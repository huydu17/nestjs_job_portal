import { IsEnum } from 'class-validator';
import { Level } from 'src/common/enums/level.enum';

export class UpdateCandidateLanguageDto {
  @IsEnum(Level)
  level: Level;
}
