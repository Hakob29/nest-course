import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmConfig } from 'orm-config';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(OrmConfig.options),
    UsersModule,
    RolesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
