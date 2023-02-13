import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { User } from "src/user/user.entity";



@Entity("Role")
export class Role {

    @ApiProperty({ example: "ID", description: "Primary Key" })
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number


    @ApiProperty({ example: "ADMIN", description: "Unique Role Value" })
    @Column({ type: String, unique: true, nullable: false })
    value: string

    @ApiProperty({ example: "Administrator", description: "About Role" })
    @Column({ type: String, nullable: false })
    description: string


    @ManyToMany(() => User, (user) => user.role)
    users: User[]


    @ApiProperty({ example: "23/01/23", description: "Created Date..." })
    @CreateDateColumn({ type: Date })
    createdAt: Date

    @ApiProperty({ example: "23/01/23", description: "Updated Date..." })
    @UpdateDateColumn({ type: Date })
    updatedAt: Date

}