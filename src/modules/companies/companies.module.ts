import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { UserModule } from '@users/user.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), UserModule, PaginationModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
