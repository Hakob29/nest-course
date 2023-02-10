import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from './roles.entity';


@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Roles)
        private readonly roles: Repository<Roles>
    ) { }


    //CREATE ROLES
    async createRole(dto: CreateRoleDto) {
        try {
            const role = await this.roles.create(dto);
            return await this.roles.save(role);
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    //GET ALL ROLES 
    async getAllRoles(): Promise<Roles[]> {
        try {
            const roles = await this.roles.find();
            return roles;
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }




    //GET ROLES BY VALUE
    async getRoleByValue(value: string) {
        try {
            const role = await this.roles.findOne({ where: { value: value } });
            if (!role) throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
            return role;
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.NOT_FOUND);
        }
    }

    //UPDATE ROLE BY VALUE
    async updateRole(dto: UpdateRoleDto): Promise<Roles> {
        try {
            const role = await this.roles.findOne({ where: { value: dto.role } });
            if (!role) throw new Error("USER NOT FOUND!")
            await this.roles.update(role.id, { value: dto.newRole })
            return role;
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }


    //DELETE ROLE 
    async deleteRole(value: string): Promise<DeleteResult> {
        try {
            const role = await this.roles.findOne({ where: { value: value } });
            if (!role) throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
            return await this.roles.delete(role.id);
        } catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.NOT_FOUND);
        }
    }
}
