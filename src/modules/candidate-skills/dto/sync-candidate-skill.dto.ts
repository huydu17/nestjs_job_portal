import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class SyncCandidateSkillsDto {
  @ApiProperty({
    description:
      'List of skill IDs selected by the candidate. This will synchronize (overwrite) the current skill set.',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray()
  @IsInt({ each: true })
  skillIds: number[];
}
