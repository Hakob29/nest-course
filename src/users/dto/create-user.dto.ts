import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';


export class CreateUserDto {

    @ApiProperty({ example: "example@gmail.com", description: "Email" })
    @IsEmail({}, { message: "Incorrect email" })
    readonly email: string

    @Length(4, 10)
    @ApiProperty({ example: "example", description: "Password" })
    readonly password: string

}