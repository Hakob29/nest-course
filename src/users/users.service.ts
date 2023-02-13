import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
import { AddUserRoleDto } from './dto/add-user-role.dto';
import { Roles } from 'src/roles/roles.entity';
import { BanUserDto } from './dto/ban-user.dto';
import { PostsService } from 'src/posts/posts.service';
import { connected } from 'process';


@Injectable()
export class UsersService extends TypeOrmQueryService<User> {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly rolesService: RolesService,
        @Inject(forwardRef(() => PostsService))
        private readonly postsService: PostsService
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
            const role = await this.rolesService.getRoleByValue("ADMIN");
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
            return await this.userRepo.find({ relations: { roles: true, posts: true } });
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

    //Find User By Id
    async findById(id: number): Promise<User> {

        try {
            const candidate: User = await this.userRepo.findOne({ where: { id: id }, relations: { posts: true } });
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
    async deleteUser(dto: DeleteUserDto) {
        try {
            const candidate: User = await this.userRepo.findOne({ where: { email: dto.email }, relations: ["roles", "posts"] });
            candidate.posts.forEach(async (post) => await this.postsService.deletePost(post.title));
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
            await this.postsService.restorePost(restoredUser.id)
            return restoredUser;
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }

    }

    //GET DELETED USER
    async getDeletedUser(dto: RestoreUserDto): Promise<User> {
        try {
            const deletedUsers: User[] = await this.userRepo.createQueryBuilder("users")
                .withDeleted()
                .where(`users.deletedAt IS NOT NULL`)
                .getMany();
            if (!deletedUsers) throw new HttpException("Users Not Found...", HttpStatus.NOT_FOUND);
            const deletedUser: User[] = deletedUsers.filter((user) => {
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

    //ADD ROLE TO USER 
    async addUserRole(dto: AddUserRoleDto): Promise<User[]> {
        try {
            const user: User[] = await this.userRepo.find({ where: { email: dto.email }, relations: ["roles"] });
            const role: Roles = await this.rolesService.getRoleByValue(dto.role);
            if (!user[0] && !role) throw new HttpException("USER NOT FOUND", HttpStatus.NOT_FOUND);
            user[0].roles.push(role);
            await this.userRepo.save(user);
            return user;
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    //BANNED USER 
    async ban(dto: BanUserDto): Promise<User[]> {
        const user: User[] = await this.userRepo.find({ where: { email: dto.email }, relations: ["roles"] });
        if (!user[0]) throw new HttpException("USER NOT FOUND", HttpStatus.NOT_FOUND);
        user[0].banned = true;
        user[0].baReason = dto.banReason

        await this.userRepo.save(user);

        return user;
    }
}
