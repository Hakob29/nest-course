import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Post as Posts } from './post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { Role } from 'src/auth/auth-roles.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { DeleteResult, UpdateResult } from 'typeorm';


Role('ADMIN')
@UseGuards(RoleGuard)
@ApiTags("Post")
@Controller('post')
export class PostController {

    constructor(
        private readonly postService: PostService
    ) { }


    //CREATE POST
    @ApiOperation({ summary: "Create Post..." })
    @ApiResponse({ status: 200, type: Posts })
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
        return await this.postService.createPost(dto, file);
    }

    //GET ALL POSTS
    @ApiOperation({ summary: "Get All Post..." })
    @ApiResponse({ status: 200, type: Posts })
    @Get("/all")
    async getAllPosts(): Promise<Posts[]> {
        return await this.postService.getAllPosts();
    }

    //GET POST BY TITILE
    @ApiOperation({ summary: "Get Post By Title..." })
    @ApiResponse({ status: 200, type: Posts })
    @Get("/:title")
    async getPostByTitle(
        @Param("title") title: string
    ): Promise<Posts> {
        return await this.postService.getPostByTitle(title);
    }

    //UPDATE POST 
    @ApiOperation({ summary: "Update Post..." })
    @ApiResponse({ status: 200, type: Posts })
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
        return await this.postService.updatePost(dto, file);
    }

    //DELETE POST
    @ApiOperation({ summary: "Delete Post..." })
    @ApiResponse({ status: 200, type: Posts })
    @Delete("/delete/:title")
    async deletePost(
        @Param("title") title: string
    ): Promise<DeleteResult> {
        return await this.postService.deletePost(title);
    }


    //RESTORE DELETED POST
    @ApiOperation({ summary: "Restore Deleted Post..." })
    @ApiResponse({ status: 200, type: Posts })
    @Post("/restore/:id")
    async restoreUser(
        @Param("id") id: number
    ): Promise<Posts[]> {
        return await this.postService.restorePost(id);
    }
}