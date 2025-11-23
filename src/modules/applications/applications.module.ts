import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { JobsModule } from '../jobs/jobs.module';
import { CandidateProfilesModule } from '../candidate-profiles/candidate-profiles.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    JobsModule,
    CandidateProfilesModule,
    PaginationModule,
    CompaniesModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
