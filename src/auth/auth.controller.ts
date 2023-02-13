import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags("Authorization")
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }


    //REGISTER
    @ApiOperation({ summary: "Register" })
    @ApiResponse({ status: 200, type: User })
    @Post("/register")
    async register(@Body() dto: CreateUserDto): Promise<User> {
        return await this.authService.register(dto);
    }


    //LOGIN
    @ApiOperation({ summary: "Login" })
    @ApiResponse({ status: 200, type: User })
    @Post("/login")
    async login(@Body() dto: CreateUserDto): Promise<{ token: string }> {
        return await this.authService.login(dto);
    }

}
