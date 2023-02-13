import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';


export class UpdateUserDto {

    @IsEmail({}, { message: "Incorrect email" })
    @ApiProperty({ example: "example@gmail.com", description: "Email" })
    email: string;

    @Length(4, 10)
    @ApiProperty({ example: "Password Example", description: "Password" })
    password: string;

    @IsEmail({}, { message: "Incorrect email" })
    @ApiProperty({ example: "example@gmail.com", description: "Email" })
    newEmail: string;

    @Length(4, 10)
    @ApiProperty({ example: "New Password Example", description: "Password" })
    newPassword: string;
}