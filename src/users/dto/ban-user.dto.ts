
import { ApiProperty } from '@nestjs/swagger';

export class BanUserDto {

    @ApiProperty({ example: "example@gmail.com", description: "Email" })
    email: string;

    @ApiProperty({ example: "Reason text...", description: "Reason" })
    banReason: string
}