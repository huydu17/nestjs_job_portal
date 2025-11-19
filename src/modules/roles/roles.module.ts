import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { UserModule } from '@users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission]), UserModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
