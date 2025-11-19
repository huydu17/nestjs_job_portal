import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { UserModule } from '@users/user.module';
import { CompaniesModule } from '../companies/companies.module';
import { PackagesModule } from '../packages/packages.module';
import { RecruiterPackagesModule } from '../recruiter-packages/recruiter-packages.module';
import { JobBenefit } from './entities/job-benefit.entity';
import { JobSkill } from './entities/job-skill.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { SkillsModule } from '../skills/skills.module';
import { BenefitsModule } from '../benefits/benefits.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job, JobBenefit, JobSkill]),
    UserModule,
    CompaniesModule,
    PackagesModule,
    RecruiterPackagesModule,
    PaginationModule,
    SkillsModule,
    BenefitsModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
