

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/role/role.entity';
import { RoleService } from 'src/role/role.service';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';
import { PostService } from 'src/post/post.service';
import { PostModule } from 'src/post/post.module';
import { Post } from 'src/post/post.entity';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Post]),
    forwardRef(() => AuthModule),
    forwardRef(() => PostModule)
  ],
  controllers: [UserController],
  providers: [
    UserService,
    RoleService,
    PostService,
    FilesService
  ],
  exports: [
    UserService,
    RoleService,
    PostService,
    FilesService
  ]
})
export class UserModule { }