import { Module } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { UserRolesController } from './user-roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './entities/user-role.entity';
import { RolesModule } from '@roles/roles.module';
import { UserModule } from '@users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole]), RolesModule, UserModule],
  controllers: [UserRolesController],
  providers: [UserRolesService],
  exports: [UserRolesService],
})
export class UserRolesModule {}
