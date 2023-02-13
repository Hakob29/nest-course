import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Posts } from './posts.entity';
import { title } from 'process';
import { UpdatePostDto } from './dto/update-post.dto';
import { Roles } from 'src/auth/auth-roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { DeleteResult, UpdateResult } from 'typeorm';


Roles('ADMIN')
@UseGuards(RolesGuard)
@ApiTags("Posts")
@Controller('posts')
export class PostsController {

    constructor(
        private readonly postsService: PostsService
    ) { }


    //CREATE POST
    @ApiOperation({ summary: "Create Posts..." })
    @ApiResponse({ status: 200, type: Post })
    @ApiBody({
        schema: CreatePostDto
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    @Post("/create")
    async createPost(
        @UploadedFile("file") file: Express.Multer.File,
        @Body() dto: any
    ): Promise<Posts> {
        return await this.postsService.createPost(dto, file);
    }

    //GET ALL POSTS
    @ApiOperation({ summary: "Get All Posts..." })
    @ApiResponse({ status: 200, type: Post })
    @Get("/all")
    async getAllPosts(): Promise<Posts[]> {
        return await this.postsService.getAllPosts();
    }

    //GET POST BY TITILE
    @ApiOperation({ summary: "Get Posts By Title..." })
    @ApiResponse({ status: 200, type: Post })
    @Get("/:title")
    async getPostByTitle(
        @Param("title") title: string
    ): Promise<Posts> {
        return await this.postsService.getPostByTitle(title);
    }

    //UPDATE POST 
    @ApiOperation({ summary: "Update Posts..." })
    @ApiResponse({ status: 200, type: Post })
    @ApiBody({
        schema: UpdatePostDto
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    @Put("/update")
    async updatePost(
        @UploadedFile("file") file: Express.Multer.File,
        @Body() dto: any
    ): Promise<UpdateResult> {
        return await this.postsService.updatePost(dto, file);
    }

    //DELETE POST
    @ApiOperation({ summary: "Delete Posts..." })
    @ApiResponse({ status: 200, type: Post })
    @Delete("/delete/:title")
    async deletePost(
        @Param("title") title: string
    ): Promise<DeleteResult> {
        return await this.postsService.deletePost(title);
    }


    //RESTORE DELETED POST
    @ApiOperation({ summary: "Restore Deleted Posts..." })
    @ApiResponse({ status: 200, type: Posts })
    @Post("/restore/:id")
    async restoreUser(
        @Param("id") id: number
    ): Promise<Posts[]> {
        return await this.postsService.restorePost(id);
    }
}