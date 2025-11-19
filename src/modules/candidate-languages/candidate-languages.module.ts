import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateLanguage } from './entities/candidate-language.entity';
import { CandidateLanguagesController } from './candidate-languages.controller';
import { CandidateLanguagesService } from './candidate-languages.service';
import { CandidateProfilesModule } from '../candidate-profiles/candidate-profiles.module';
import { LanguagesModule } from '../languages/languages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CandidateLanguage]),
    CandidateProfilesModule,
    LanguagesModule,
  ],
  controllers: [CandidateLanguagesController],
  providers: [CandidateLanguagesService],
  exports: [CandidateLanguagesService],
})
export class CandidateLanguagesModule {}
