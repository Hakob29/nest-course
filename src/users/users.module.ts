import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/roles/roles.entity';
import { RolesService } from 'src/roles/roles.service';
import { User } from './users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Roles]),
    forwardRef(() => AuthModule)
  ],
  controllers: [UsersController],
  providers: [UsersService, RolesService],
  exports: [
    UsersService,
  ]
})
export class UsersModule { }
