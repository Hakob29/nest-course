
import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { User } from 'src/users/users.entity';
import { FilesModule } from 'src/files/files.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { Roles } from 'src/roles/roles.entity';
import { UsersService } from 'src/users/users.service';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, User, Roles]),
    FilesModule,
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule)
  ],
  providers: [PostsService, UsersService, FilesService],
  controllers: [PostsController],
  exports: [PostsService]
})
export class PostsModule { }