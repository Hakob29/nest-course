import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DeleteResult } from 'typeorm';
import { Role as ROLE } from 'src/auth/auth-roles.decorator';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from './role.entity';



// @ROLE("ADMIN")
// @UseGuards(RoleGuard)
@ApiTags("Role")
@Controller('role')
export class RoleController {
    constructor(
        private readonly roleService: RoleService
    ) { }


    //CREATE NEW ROLE
    @ApiOperation({ summary: "Create Role..." })
    @ApiResponse({ status: 200, type: Role })
    @Post("/create")
    async createRole(
        @Body() dto: CreateRoleDto
    ): Promise<Role> {
        return await this.roleService.createRole(dto);
    }


    //GET ALL ROLES
    @ApiOperation({ summary: "Get All Roles..." })
    @ApiResponse({ status: 200, type: Role })
    @Get("/all")
    async getAllRoles(): Promise<Role[]> {
        return await this.roleService.getAllRoles();
    }


    //GET ROLE BY VALUE
    @ApiOperation({ summary: "Get Role By Value..." })
    @ApiResponse({ status: 200, type: Role })
    @Get("/get/:value")
    async getRoleByValue(
        @Param("value") value: string
    ): Promise<Role> {
        return await this.roleService.getRoleByValue(value);
    }


    //UPDATE ROLE BY VALUE
    @ApiOperation({ summary: "Update Role By Value..." })
    @ApiResponse({ status: 200, type: Role })
    @Put("/update")
    async updateRole(
        @Body() dto: UpdateRoleDto
    ): Promise<Role> {
        return await this.roleService.updateRole(dto);
    }

    //DELETE ROLE 
    @ApiOperation({ summary: "Delete Role By Value..." })
    @ApiResponse({ status: 200, type: Role })
    @Delete("/delete/:value")
    async deleteRole(@Param("value") value: string): Promise<DeleteResult> {
        return await this.roleService.deleteRole(value);
    }
}
