import { ApiProperty } from '@nestjs/swagger';


export class DeleteUserDto {

    @ApiProperty({ example: "example@gmail.com", description: "email" })
    email: string;

    @ApiProperty({ example: "Password", description: "Password" })
    password: string;
}