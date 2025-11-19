import { PartialType } from '@nestjs/mapped-types';
import { CreateCandidateEducationDto } from './create-candidate-education.dto';

export class UpdateCandidateEducationDto extends PartialType(
  CreateCandidateEducationDto,
) {}
