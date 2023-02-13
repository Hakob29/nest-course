import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { Role } from "src/role/role.entity";
import { Post } from "src/post/post.entity";


@Entity("User")
export class User {

    @ApiProperty({ example: "ID", description: "Primary Key" })
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number;

    @ApiProperty({ example: "example@gmail.com", description: "Email" })
    @Column({ type: String, nullable: false, unique: true })
    email: string;

    @ApiProperty({ example: "example", description: "Password" })
    @Column({ type: String, nullable: false })
    password: string;

    @ApiProperty({ example: "true or false", description: "Banned or not" })
    @Column({ type: Boolean, default: false })
    banned: Boolean;

    @ApiProperty({ example: "Banned Reason", description: "Reason" })
    @Column({ type: String, nullable: true, })
    baReason: string;


    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable({ name: "User-Roles-Table" })
    role: Role[];

    @OneToMany(() => Post, (post) => post.author, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    })
    post: Post[]

    @ApiProperty({ example: "23/01/23", description: "Created Date..." })
    @CreateDateColumn({ type: Date })
    createdAt: Date

    @ApiProperty({ example: "23/01/23", description: "Updated Date..." })
    @UpdateDateColumn({ type: Date })
    updatedAt: Date

    @ApiProperty({ example: "23/01/23", description: "Deleted Date..." })
    @DeleteDateColumn({ type: Date })
    deletedAt?: Date
}