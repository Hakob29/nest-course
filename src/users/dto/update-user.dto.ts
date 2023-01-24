import { ApiProperty } from '@nestjs/swagger';


export class UpdateUserDto {

    @ApiProperty({ example: "example@gmail.com", description: "Email" })
    email: string;

    @ApiProperty({ example: "Password Example", description: "Password" })
    password: string;

    @ApiProperty({ example: "example@gmail.com", description: "Email" })
    newEmail: string;

    @ApiProperty({ example: "New Password Example", description: "Password" })
    newPassword: string;
}