import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmConfig } from 'orm-config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { FilesModule } from './files/files.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(OrmConfig.options),
    UserModule,
    RoleModule,
    AuthModule,
    PostModule,
    FilesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
