import { IsArray, IsInt } from 'class-validator';

export class SyncCandidateSkillsDto {
  @IsArray()
  @IsInt({ each: true })
  skillIds: number[];
}
