import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateExperience } from './entities/candidate-experience.entity';
import { CandidateExperiencesController } from './candidate-experiences.controller';
import { CandidateExperiencesService } from './candidate-experiences.service';
import { CandidateProfilesModule } from '../candidate-profiles/candidate-profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CandidateExperience]),
    CandidateProfilesModule,
  ],
  controllers: [CandidateExperiencesController],
  providers: [CandidateExperiencesService],
  exports: [CandidateExperiencesService],
})
export class CandidateExperiencesModule {}
