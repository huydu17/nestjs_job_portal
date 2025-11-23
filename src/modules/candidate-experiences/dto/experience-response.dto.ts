import { Expose } from 'class-transformer';

export class CandidateExperienceResponseDto {
  @Expose()
  id: number;

  @Expose()
  company: string;

  @Expose()
  department: string;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  responsibilities: string;
}
