import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';


@Entity("Post")
export class Post {

    @ApiProperty({ example: "ID", description: "Primary Key" })
    @PrimaryGeneratedColumn({ type: "bigint" })
    id: number

    @ApiProperty({ example: "Title", description: "Write title..." })
    @Column({ type: String, nullable: false, unique: true })
    title: string

    @ApiProperty({ example: "Content", description: "Write content..." })
    @Column({ type: String, nullable: false })
    content: string

    @ApiProperty({ example: "Image", description: "Link..." })
    @Column({ type: String })
    image: string

    @ManyToOne(() => User, (user) => user.post)
    author: User


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