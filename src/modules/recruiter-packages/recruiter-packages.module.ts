import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruiterPackage } from './entities/recruiter-package.entity';
import { RecruiterPackagesController } from './recruiter-packages.controller';
import { RecruiterPackagesService } from './recruiter-packages.service';
import { UserModule } from '@users/user.module';
import { PackagesModule } from '../packages/packages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecruiterPackage]),
    UserModule,
    PackagesModule,
  ],
  controllers: [RecruiterPackagesController],
  providers: [RecruiterPackagesService],
  exports: [RecruiterPackagesService],
})
export class RecruiterPackagesModule {}
