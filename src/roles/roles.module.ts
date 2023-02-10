import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Roles } from './roles.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Roles, User]),
    forwardRef(() => AuthModule)
  ],
  controllers: [RolesController],
  providers: [RolesService]
})
export class RolesModule { }