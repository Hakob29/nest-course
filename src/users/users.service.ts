import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.entity';
import * as bcrypt from "bcrypt";
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { RestoreUserDto } from './dto/restore-user.dto';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService extends TypeOrmQueryService<User> {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly roleSerivce: RolesService
    ) {
        super(userRepo, { useSoftDelete: true })
    }

    //CREATE NEW USER
    async createUser(dto: CreateUserDto): Promise<User> {
        try {
            const user: User = await this.userRepo.create({
                email: dto.email,
                password: await bcrypt.hash(dto.password, 10)
            });
            const role = await this.roleSerivce.getRoleByValue("USER");
            user.roles = [role];
            await this.userRepo.save(user);
            return user;
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }

    }

    //FIND ALL USERS 
    async findAllUsers() {
        try {
            return await this.userRepo.find({ relations: { roles: true } });
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    //FINDE USER BY EMAIL
    async findeOne(email: string): Promise<User> {

        try {
            const candidate: User = await this.userRepo.findOne({ where: { email }, relations: { roles: true } });
            if (!candidate) throw new HttpException("USER NOT FOUND!", HttpStatus.NOT_FOUND);
            return candidate;
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.NOT_FOUND);

        }
    }

    //UPDATE USER BY EMAIL AND PASSWORD
    async updateUser(dto: UpdateUserDto): Promise<UpdateResult> {
        try {
            const candidate: User = await this.userRepo.findOne({ where: { email: dto.email }, relations: ["roles"] });
            if (!candidate) throw new HttpException("USER NOT FOUND!", HttpStatus.NOT_FOUND);
            if (!(await bcrypt.compare(dto.password, candidate.password))) throw new HttpException("INVALID PASSWORD", HttpStatus.NOT_FOUND);
            return await this.userRepo.update(candidate.id, {
                email: dto.newEmail,
                password: await bcrypt.hash(dto.newPassword, 10),
                banned: false
            })
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);

        }
    }

    //DELETE USER BY EMAIL AND PASSWORD
    async deleteUser(dto: DeleteUserDto): Promise<User> {
        try {
            const candidate: User = await this.userRepo.findOne({ where: { email: dto.email }, relations: ["roles"] });
            if (!candidate) throw new HttpException("USER NOT FOUND!", HttpStatus.NOT_FOUND);
            if (!(await bcrypt.compare(dto.password, candidate.password))) throw new HttpException("INVALID PASSWORD", HttpStatus.NOT_FOUND);
            return await this.userRepo.softRemove(candidate);
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    //GET ALL DELETED USERS
    async getDeletedUsers(): Promise<User[]> {
        try {
            const deletedUsers: User[] = await this.userRepo.createQueryBuilder("user")
                .withDeleted()
                .where(`user.deletedAt IS NOT NULL`)
                .getMany();
            return deletedUsers;
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    //RESTORE DELETED USER
    async restoreUser(dto: RestoreUserDto) {
        try {
            const restoredUser: User = await this.getDeletedUser(dto);
            if (!restoredUser) throw new Error("user Not Found...");
            await this.userRepo.restore(restoredUser.id);
            return restoredUser;
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }

    }

    //GET DELETED USER
    async getDeletedUser(dto: RestoreUserDto): Promise<User> {
        try {
            const deletedUsers: User[] = await this.userRepo.createQueryBuilder("user")
                .withDeleted()
                .where(`user.deletedAt IS NOT NULL`)
                .getMany();
            if (!deletedUsers) throw new HttpException("Users Not Found...", HttpStatus.NOT_FOUND);
            const deletedUser = deletedUsers.filter((user) => {
                if (user.email === dto.email) {
                    return user;
                }
            })
            if (!(await bcrypt.compare(dto.password, deletedUser[0].password))) throw new HttpException("INVALID PASSWORD", HttpStatus.NOT_FOUND);
            return deletedUser[0];
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }

    }
}
