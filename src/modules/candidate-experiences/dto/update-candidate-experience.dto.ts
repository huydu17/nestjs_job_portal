import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidateExperienceDto } from './create-candidate-experience.dto';

export class UpdateCandidateExperienceDto extends PartialType(
  CreateCandidateExperienceDto,
) {}
