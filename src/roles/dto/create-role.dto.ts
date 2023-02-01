import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class CreateRoleDto {

    @ApiProperty({ example: "USER", description: "User" })
    @IsNotEmpty({ message: "Can not be empty..." })
    value: string

    @ApiProperty({ example: "Simple User...", description: "Simple User..." })
    @IsNotEmpty({ message: "Can not be empty..." })
    description: string

}