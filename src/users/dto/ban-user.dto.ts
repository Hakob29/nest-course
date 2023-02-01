
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class BanUserDto {

    @IsEmail({}, { message: "Incorrect email" })
    @ApiProperty({ example: "example@gmail.com", description: "Email" })
    email: string;

    @ApiProperty({ example: "Reason text...", description: "Reason" })
    @IsNotEmpty({ message: "Can not be empty..." })
    banReason: string
}