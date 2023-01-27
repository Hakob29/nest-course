import { ApiProperty } from '@nestjs/swagger';


export class UpdateRoleDto {

    @ApiProperty({ example: "USER", description: "User" })
    role: string;

    @ApiProperty({ example: "NEW ROLE", description: "New Role" })
    newRole: string
}