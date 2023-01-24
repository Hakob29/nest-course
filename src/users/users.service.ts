import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user-entity';
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';

@Injectable()
export class UsersService extends TypeOrmQueryService<User> {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>
    ) {
        super(userRepo, { useSoftDelete: true })
    }

    //CREATE NEW USER
    async createUser(dto: CreateUserDto): Promise<User> {

        try {
            const user = await this.userRepo.create({
                email: dto.email,
                password: await bcrypt.hash(dto.password, 10)
            });
            return await this.userRepo.save(user);
        } catch (err) {
            console.log(err);
            throw new HttpException("Something bad happened", HttpStatus.BAD_REQUEST);
        }

    }

    //FIND ALL USERS 
    async findAllUsers() {
        try {
            return await this.userRepo.find();
        } catch (err) {
            console.log(err);
            throw new HttpException("Something bad happened", HttpStatus.BAD_REQUEST);
        }
    }

    //FINDE USER BY EMAIL
    async findeOne(email: string): Promise<User> {

        try {
            const candidate = await this.userRepo.findOne({ where: { email } });
            if (!candidate) throw new HttpException("USER NOT FOUND!", HttpStatus.NOT_FOUND);
            return candidate;
        } catch (err) {
            console.log(err);
            throw new HttpException("USER NOT FOUND!", HttpStatus.NOT_FOUND);

        }
    }

    //UPDATE USER BY EMAIL AND PASSWORD
    async updateUser(dto: UpdateUserDto): Promise<UpdateResult> {
        try {
            const candidate = await this.userRepo.findOne({ where: { email: dto.email } });
            if (!candidate) throw new HttpException("USER NOT FOUND!", HttpStatus.NOT_FOUND);
            if (!(await bcrypt.compare(dto.password, candidate.password))) throw new HttpException("INVALID PASSWORD", HttpStatus.NOT_FOUND);
            return await this.userRepo.update(candidate.id, {
                email: dto.newEmail,
                password: await bcrypt.hash(dto.newPassword, 10),
                banned: false
            })
        } catch (err) {
            console.log(err);
            throw new HttpException("Something bad happened", HttpStatus.BAD_REQUEST);

        }
    }

    //DELETE USER BY EMAIL AND PASSWORD
    async deleteUser(dto: DeleteUserDto): Promise<UpdateResult> {
        try {

            const candidate = await this.userRepo.findOne({ where: { email: dto.email } });
            if (!candidate) throw new HttpException("USER NOT FOUND!", HttpStatus.NOT_FOUND);
            if (!(await bcrypt.compare(dto.password, candidate.password))) throw new HttpException("INVALID PASSWORD", HttpStatus.NOT_FOUND);
            return await this.userRepo.softDelete(candidate.id)
        } catch (err) {
            console.log(err);
            throw new HttpException("Something bad happened", HttpStatus.BAD_REQUEST);
        }
    }
}
