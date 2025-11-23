/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Expose, Transform } from 'class-transformer';

export class CandidateSkillResponseDto {
  @Expose()
  @Transform(({ obj }) => obj.skill?.id)
  id: number;

  @Expose()
  @Transform(({ obj }) => obj.skill?.name)
  name: string;
}
