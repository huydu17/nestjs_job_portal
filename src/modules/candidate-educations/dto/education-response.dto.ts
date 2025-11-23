import { Expose } from 'class-transformer';
import { Degree } from 'src/common/enums/degree.enum';

export class CandidateEducationResponseDto {
  @Expose()
  id: number;

  @Expose()
  educationName: string;

  @Expose()
  major: string;

  @Expose()
  degree: Degree;

  @Expose()
  yearStart: number;

  @Expose()
  yearEnd: number;
}
