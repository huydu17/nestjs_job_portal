import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateSkill } from './entities/candidate-skill.entity';
import { CandidateSkillsController } from './candidate-skills.controller';
import { CandidateSkillsService } from './candidate-skills.service';
import { CandidateProfilesModule } from '../candidate-profiles/candidate-profiles.module';
import { SkillsModule } from '../skills/skills.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CandidateSkill]),
    CandidateProfilesModule,
    SkillsModule,
  ],
  controllers: [CandidateSkillsController],
  providers: [CandidateSkillsService],
  exports: [CandidateSkillsService],
})
export class CandidateSkillsModule {}
