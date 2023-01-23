import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user-entity';
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly repo: Repository<User>
    ) { }

    async createUser(dto: CreateUserDto): Promise<User> {

        try {
            const user = await this.repo.create({
                email: dto.email,
                password: await bcrypt.hash(dto.password, 10)
            });
            return await this.repo.save(user);
        } catch (err) {
            console.log(err);
            throw new HttpException("Something bad happened", HttpStatus.BAD_REQUEST);
        }

    }

    async findAllUsers() {
        try {
            return await this.repo.find();
        } catch (err) {
            console.log(err);
            throw new HttpException("Something bad happened", HttpStatus.BAD_REQUEST);
        }
    }

    async findeOne(email: string): Promise<User> {

        try {
            const candidate = await this.repo.findOne({ where: { email } });
            if (!candidate) throw new HttpException("USER NOT FOOUND!", HttpStatus.NOT_FOUND);
            return candidate;
        } catch (err) {
            console.log(err);
            throw new HttpException("USER NOT FOOUND!", HttpStatus.NOT_FOUND);

        }
    }
}
