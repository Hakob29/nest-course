import { ApiProperty } from '@nestjs/swagger';

export class RestoreUserDto {

    @ApiProperty({ example: "example@gmail.com", description: "email" })
    email: string

    @ApiProperty({ example: "Password", description: "email" })
    password: string
}