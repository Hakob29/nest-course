import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';


export class AddUserRoleDto {

    @ApiProperty({ example: "example@gmail.com", description: "Email" })
    @IsEmail({}, { message: "Incorrect email" })
    readonly email: string


    @ApiProperty({ example: "ADMIN", description: "Admin" })
    @IsNotEmpty({ message: "Can not be empty..." })
    readonly role: string

}