import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from './roles.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DeleteResult, UpdateResult } from 'typeorm';


@ApiTags("Roles")
@Controller('roles')
export class RolesController {
    constructor(
        private readonly roleService: RolesService
    ) { }


    //CREATE NEW ROLE
    @ApiOperation({ summary: "Create Role..." })
    @ApiResponse({ status: 200, type: Roles })
    @Post("/create")
    async createRole(
        @Body() dto: CreateRoleDto
    ): Promise<Roles> {
        return await this.roleService.createRole(dto);
    }


    //GET ALL ROLES
    @ApiOperation({ summary: "Get All Roles..." })
    @ApiResponse({ status: 200, type: Roles })
    @Get("/all")
    async getAllRoles(): Promise<Roles[]> {
        return await this.roleService.getAllRoles();
    }


    //GET ROLE BY VALUE
    @ApiOperation({ summary: "Get Role By Value..." })
    @ApiResponse({ status: 200, type: Roles })
    @Get("/get/:value")
    async getRoleByValue(
        @Param("value") value: string
    ): Promise<Roles> {
        return await this.roleService.getRoleByValue(value);
    }


    //UPDATE ROLE BY VALUE
    @ApiOperation({ summary: "Update Role By Value..." })
    @ApiResponse({ status: 200, type: Roles })
    @Put("/update")
    async updateRole(
        @Body() dto: UpdateRoleDto
    ): Promise<Roles> {
        return await this.roleService.updateRole(dto);
    }

    //DELETE ROLE 
    @ApiOperation({ summary: "Delete Role By Value..." })
    @ApiResponse({ status: 200, type: Roles })
    @Delete("/delete/:value")
    async deleteRole(@Param("value") value: string): Promise<DeleteResult> {
        return await this.roleService.deleteRole(value);
    }
}
