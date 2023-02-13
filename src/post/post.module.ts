
import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { User } from 'src/user/user.entity';
import { FilesModule } from 'src/files/files.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { Role } from 'src/role/role.entity';
import { UserService } from 'src/user/user.service';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Role]),
    FilesModule,
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule)
  ],
  providers: [PostService, UserService, FilesService],
  controllers: [PostController],
  exports: [PostService]
})
export class PostModule { }