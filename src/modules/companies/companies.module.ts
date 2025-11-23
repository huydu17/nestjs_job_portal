import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { UserModule } from '@users/user.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { CompanyIndustriesService } from './providers/company-industries.service';
import { CompanyImagesService } from './providers/company-images.service';
import { CompanyImage } from './entities/company-image.entity';
import { CompanyIndustry } from './entities/company-industry.entity';
import { IndustriesModule } from '../industries/industries.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, CompanyImage, CompanyIndustry]),
    UserModule,
    PaginationModule,
    IndustriesModule,
    CloudinaryModule,
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, CompanyIndustriesService, CompanyImagesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
