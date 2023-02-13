import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    //REGISTER
    async register(dto: CreateUserDto) {
        try {
            return this.userService.createUser(dto);

        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
        }
    }

    //LOGIN
    async login(dto: CreateUserDto): Promise<{ token: string }> {
        try {
            const user = await this.userService.findeOne(dto.email);
            if (!(await bcrypt.compare(dto.password, user.password))) throw new UnauthorizedException({ messgae: "Incorrect User" })
            return await this.generateToken(user);
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
        }

    }


    //GENERATE JWT TOKEN FOR USER
    async generateToken(user: User) {
        const payload = {
            email: user.email,
            id: user.id,
            roles: user.role
        }
        return {
            token: this.jwtService.sign(payload)
        }
    }
}
