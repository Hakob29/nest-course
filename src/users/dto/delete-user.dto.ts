import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';


export class DeleteUserDto {

    @ApiProperty({ example: "example@gmail.com", description: "email" })
    @IsEmail({}, { message: "Incorrect email" })
    email: string;

    @Length(4, 10)
    @ApiProperty({ example: "Password", description: "Password" })
    password: string;
}