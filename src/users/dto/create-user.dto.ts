import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto {

    @ApiProperty({ example: "example@gmail.com", description: "Email" })
    readonly email: string
    @ApiProperty({ example: "example", description: "Password" })
    readonly password: string

}