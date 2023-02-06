import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Posts } from './posts.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';


@Injectable()
export class PostsService extends TypeOrmQueryService<Posts> {
    constructor(
        @InjectRepository(Posts)
        private readonly postRepo: Repository<Posts>,
        private readonly filesService: FilesService,
        private readonly userService: UsersService
    ) {
        super(postRepo, { useSoftDelete: true })
    }

    //CREATE POST 
    async createPost(dto: any, file: Express.Multer.File): Promise<Posts> {
        try {
            const user: User = await this.userService.findById(dto.authorId);
            const fileName: string = await this.filesService.createFile(file);
            const post: Posts = await this.postRepo.create({
                title: dto.title,
                content: dto.content,
                author: user,
                image: fileName
            })
            await this.postRepo.save(post);
            return post;
        } catch (err) {
            console.log(err.message);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    //GET ALL POSTS
    async getAllPosts(): Promise<Posts[]> {
        try {
            const posts: Posts[] = await this.postRepo.find();
            return posts;
        } catch (err) {
            console.log(err.message);
            throw new HttpException(err.message, HttpStatus.NOT_FOUND);
        }
    }

    //GET POST BY TITLE
    async getPostByTitle(title: string): Promise<Posts> {
        try {
            const post = await this.postRepo.findOne({ where: { title } });
            if (!post) throw new HttpException("POST NOT FOUNDDD!!!", HttpStatus.NOT_FOUND);
            return post;
        } catch (err) {
            console.log(err.message);
            throw new HttpException(err.message, HttpStatus.NOT_FOUND);
        }
    }


    //UPDTAE POST 
    async updatePost(dto: any, file: Express.Multer.File): Promise<UpdateResult> {
        try {

            const post: Posts = await this.getPostByTitle(dto.title);
            if (!post) throw new HttpException("POST NOT FOUND!", HttpStatus.NOT_FOUND);
            const image = await this.filesService.createFile(file);
            if (!image) throw new HttpException("FILE DONT CREATED!", HttpStatus.BAD_REQUEST);
            await this.filesService.removeFile(post.image);
            return await this.postRepo.update(post.id, {
                title: dto.newtitle,
                content: dto.content,
                image: image
            })
        } catch (err) {
            console.log(err.message);
            throw new HttpException(err.messagem, HttpStatus.BAD_REQUEST);
        }
    }

    //DELETE POST
    async deletePost(postTitle: string): Promise<DeleteResult> {
        try {
            const post = await this.postRepo.findOne({ where: { title: postTitle } });
            if (!post) throw new HttpException("POST NOT FOUND", HttpStatus.NOT_FOUND);
            return await this.postRepo.softDelete(post.id);
        } catch (err) {
            console.log(err.message);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
        }
    }

    //RESTORE POST
    async restorePost(title: string): Promise<Posts> {
        try {
            const restoredPost: Posts = await this.getDeletedPost(title);
            if (!restoredPost) throw new Error("Post Not Found...");
            await this.postRepo.restore(restoredPost.id);
            return restoredPost;
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }


    //GET DELETED USER
    async getDeletedPost(title: string): Promise<Posts> {
        try {
            const deletedPosts: Posts[] = await this.postRepo.createQueryBuilder("posts")
                .withDeleted()
                .where(`posts.deletedAt IS NOT NULL`)
                .getMany();
            if (!deletedPosts) throw new HttpException("Post Not Foundddd...", HttpStatus.NOT_FOUND);
            const deletedPost: Posts[] = deletedPosts.filter((post) => {
                console.log(title)
                if (post.title === title) {
                    return post;
                }
            })
            return deletedPost[0];
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }
}
