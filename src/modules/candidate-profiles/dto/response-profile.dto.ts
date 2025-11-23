/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Expose, Transform, Type } from 'class-transformer';
import { Gender } from 'src/common/enums/gender.enum';
import { Level } from 'src/common/enums/level.enum';
import { CandidateEducationResponseDto } from 'src/modules/candidate-educations/dto/education-response.dto';
import { CandidateExperienceResponseDto } from 'src/modules/candidate-experiences/dto/experience-response.dto';

export class SkillResponseDto {
  @Expose()
  @Transform(({ obj }) => obj.skill?.name)
  name: string;
}

export class LanguageResponseDto {
  @Expose()
  @Transform(({ obj }) => obj.language?.name)
  name: string;

  @Expose()
  level: Level;
}

export class CandidateProfileResponseDto {
  @Expose()
  id: number;

  @Expose()
  fullName: string;

  @Expose()
  gender: Gender;

  @Expose()
  phone: string;

  @Expose()
  address: string;

  @Expose()
  birthdate: Date;

  @Expose()
  cvUrl: string;

  @Expose()
  openToWork: boolean;

  @Expose()
  @Transform(({ obj }) => obj.user?.email)
  email: string;

  @Expose()
  @Type(() => CandidateEducationResponseDto)
  candidateEducations: CandidateEducationResponseDto[];

  @Expose()
  @Type(() => CandidateExperienceResponseDto)
  candidateExperiences: CandidateExperienceResponseDto[];

  @Expose()
  @Type(() => SkillResponseDto)
  candidateSkills: SkillResponseDto[];

  @Expose()
  @Type(() => LanguageResponseDto)
  candidateLanguages: LanguageResponseDto[];
}

export class CandidateListItemDto {
  @Expose()
  id: number;

  @Expose()
  fullName: string;

  @Expose()
  openToWork: boolean;

  @Expose()
  cvUrl: string;

  @Expose()
  @Transform(({ obj }) =>
    obj.candidateSkills?.map((cs: any) => cs?.skill?.name),
  )
  skills: string[];
}
