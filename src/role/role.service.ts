import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './role.entity';


@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly role: Repository<Role>
    ) { }


    //CREATE ROLES
    async createRole(dto: CreateRoleDto): Promise<Role> {
        try {
            const role = await this.role.create(dto);
            return await this.role.save(role);
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    //GET ALL ROLES 
    async getAllRoles(): Promise<Role[]> {
        try {
            const roles = await this.role.find();
            return roles;
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }




    //GET ROLES BY VALUE
    async getRoleByValue(value: string): Promise<Role> {
        try {
            const role = await this.role.findOne({ where: { value: value } });
            if (!role) throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
            return role;
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.NOT_FOUND);
        }
    }

    //UPDATE ROLE BY VALUE
    async updateRole(dto: UpdateRoleDto): Promise<Role> {
        try {
            const role = await this.role.findOne({ where: { value: dto.role } });
            if (!role) throw new Error("USER NOT FOUND!")
            await this.role.update(role.id, { value: dto.newRole })
            return role;
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }


    //DELETE ROLE 
    async deleteRole(value: string): Promise<DeleteResult> {
        try {
            const role = await this.role.findOne({ where: { value: value } });
            if (!role) throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
            return await this.role.delete(role.id);
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.NOT_FOUND);
        }
    }
}
