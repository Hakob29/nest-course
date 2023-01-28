import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateResult } from 'typeorm';
import { DeleteUserDto } from './dto/delete-user.dto';
import { RestoreUserDto } from './dto/restore-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('user')
@ApiTags('User CRUD')
export class UsersController {

    constructor(
        private readonly usersSerivce: UsersService
    ) { }

    //FIND ALL USERS 
    @ApiOperation({ summary: "Get All Users..." })
    @ApiResponse({ status: 200, type: [User] })
    @Get("/all")
    async findAllUsers(): Promise<User[]> {
        return await this.usersSerivce.findAllUsers();
    }

    //FINDE USER BY EMAIL
    @ApiOperation({ summary: "Get Users By Email..." })
    @ApiResponse({ status: 200, type: User })
    @Get("/one/:email")
    async findOne(
        @Param("email") email: string
    ): Promise<User> {
        return await this.usersSerivce.findeOne(email)
    }

    //UPDATE USER BY EMAIL AND PASSWORD
    @ApiOperation({ summary: "Get Users By Email..." })
    @ApiResponse({ status: 200, type: User })
    @Put("/update")
    async updateUser(
        @Body() dto: UpdateUserDto
    ): Promise<UpdateResult> {
        return await this.usersSerivce.updateUser(dto);
    }

    //DELETE USER BY EMAIL AND PASSWORD
    @ApiOperation({ summary: "Delete Users By Email..." })
    @ApiResponse({ status: 200, type: User })
    @Delete("/delete")
    async deleteUser(
        @Body() dto: DeleteUserDto
    ): Promise<User> {
        return await this.usersSerivce.deleteUser(dto);
    }


    //GET ALL DELETED USERS
    @ApiOperation({ summary: "Get All Deleted Users We Have..." })
    @ApiResponse({ status: 200, type: User })
    @Get("/deleted")
    async getDeletedUser(): Promise<User[]> {
        return await this.usersSerivce.getDeletedUsers();
    }

    //RESTORE DELETED USER
    @ApiOperation({ summary: "Restore Deleted User..." })
    @ApiResponse({ status: 200, type: User })
    @Post("/restore")
    async restoreUser(
        @Body() dto: RestoreUserDto
    ) {
        return await this.usersSerivce.restoreUser(dto);
    }

}
