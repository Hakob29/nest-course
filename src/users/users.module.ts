

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/roles/roles.entity';
import { RolesService } from 'src/roles/roles.service';
import { User } from './users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { PostsService } from 'src/posts/posts.service';
import { PostsModule } from 'src/posts/posts.module';
import { Posts } from 'src/posts/posts.entity';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Roles, Posts]),
    forwardRef(() => AuthModule),
    forwardRef(() => PostsModule)
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    RolesService,
    PostsService,
    FilesService
  ],
  exports: [
    UsersService,
    RolesService,
    PostsService,
    FilesService
  ]
})
export class UsersModule { }