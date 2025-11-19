import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { User } from '@users/entities/user.entity';
import { CandidateProfilesController } from './candidate-profiles.controller';
import { CandidateProfilesService } from './candidate-profiles.service';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CandidateProfile, User]),
    PaginationModule,
    CloudinaryModule,
  ],
  controllers: [CandidateProfilesController],
  providers: [CandidateProfilesService],
  exports: [CandidateProfilesService],
})
export class CandidateProfilesModule {}
