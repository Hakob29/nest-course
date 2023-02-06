import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { User } from 'src/users/users.entity';
import { FilesModule } from 'src/files/files.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, User]),
    FilesModule,
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule)
  ],
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostsModule { }
