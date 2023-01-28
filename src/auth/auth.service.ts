import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async register(dto: CreateUserDto) {
        try {
            return this.userService.createUser(dto);

        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
        }
    }

    async login(dto: CreateUserDto) {
        try {
            const user = await this.userService.findeOne(dto.email);
            if (!(await bcrypt.compare(dto.password, user.password))) throw new UnauthorizedException({ messgae: "Incorrect User" })
            return await this.generateToken(user);
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
        }

    }

    async generateToken(user: User) {
        const payload = {
            email: user.email,
            id: user.id,
            roles: user.roles
        }
        return {
            token: this.jwtService.sign(payload)
        }
    }
}
