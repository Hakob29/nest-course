import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Post } from './post.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';


@Injectable()
export class PostService extends TypeOrmQueryService<Post> {
    constructor(
        @InjectRepository(Post)
        private readonly postRepo: Repository<Post>,
        private readonly filesService: FilesService,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService
    ) {
        super(postRepo, { useSoftDelete: true })
    }

    //CREATE POST 
    async createPost(dto: any, file: Express.Multer.File): Promise<Post> {
        try {
            const user: User = await this.userService.findById(dto.authorId);
            const fileName: string = await this.filesService.createFile(file);
            const post: Post = await this.postRepo.create({
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
    async getAllPosts(): Promise<Post[]> {
        try {
            const posts: Post[] = await this.postRepo.find();
            return posts;
        } catch (err) {
            console.log(err.message);
            throw new HttpException(err.message, HttpStatus.NOT_FOUND);
        }
    }

    //GET POST BY TITLE
    async getPostByTitle(title: string): Promise<Post> {
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

            const post: Post = await this.getPostByTitle(dto.title);
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
    async restorePost(id: number): Promise<Post[]> {
        try {
            const restoredPost: Post[] = await this.getDeletedPost(id);
            restoredPost.forEach(async (post) => {
                await this.postRepo.restore(post.id);
            })
            return restoredPost;
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }


    //GET DELETED POST
    async getDeletedPost(id: number): Promise<Post[]> {
        try {
            const deletedPosts: Post[] = await this.postRepo
                .createQueryBuilder("post")
                .withDeleted()
                .where(`post.authorId = ${id}`)
                .getMany()
            return deletedPosts
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }
}
