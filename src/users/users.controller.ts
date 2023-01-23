import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user-entity';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('user')
@ApiTags('User CRUD')
export class UsersController {

    constructor(
        private readonly usersSerivce: UsersService
    ) { }

    @ApiOperation({ summary: "Create User..." })
    @ApiResponse({ status: 200, type: User })
    @Post("/create")
    async createUser(
        @Body() dto: CreateUserDto
    ): Promise<User> {
        return await this.usersSerivce.createUser(dto);
    }

    @ApiOperation({ summary: "Get All Users..." })
    @ApiResponse({ status: 200, type: [User] })
    @Get("/all")
    async findAllUsers(): Promise<User[]> {
        return await this.usersSerivce.findAllUsers();
    }

    @ApiOperation({ summary: "Get Users By Email..." })
    @ApiResponse({ status: 200, type: User })
    @Get("/one/:email")
    async findOne(
        @Param("email") email: string
    ): Promise<User> {
        return await this.usersSerivce.findeOne(email)
    }

}
