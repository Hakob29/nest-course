import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class UpdateRoleDto {

    @IsNotEmpty({ message: "Can not be empty..." })
    @ApiProperty({ example: "USER", description: "User" })
    role: string;

    @IsNotEmpty({ message: "Can not be empty..." })
    @ApiProperty({ example: "NEW ROLE", description: "New Role" })
    newRole: string
}