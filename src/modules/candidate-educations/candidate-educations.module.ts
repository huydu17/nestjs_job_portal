import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateEducationsController } from './candidate-educations.controller';
import { CandidateEducationsService } from './candidate-educations.service';
import { CandidateEducation } from './entities/candidate-education.entity';
import { CandidateProfilesModule } from '../candidate-profiles/candidate-profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CandidateEducation]),
    CandidateProfilesModule,
  ],
  controllers: [CandidateEducationsController],
  providers: [CandidateEducationsService],
  exports: [CandidateEducationsService],
})
export class CandidateEducationsModule {}
