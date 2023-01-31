import { ApiProperty } from '@nestjs/swagger';


export class AddUserRoleDto {

    @ApiProperty({ example: "example@gmail.com", description: "Email" })
    readonly email: string

    @ApiProperty({ example: "ADMIN", description: "Admin" })
    readonly role: string

}