import { ApiProperty } from '@nestjs/swagger';


export class CreateRoleDto {


    @ApiProperty({ example: "USER", description: "User" })
    value: string

    @ApiProperty({ example: "Simple User...", description: "Simple User..." })
    description: string

}