import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Level } from 'src/common/enums/level.enum';

export class CreateCandidateLanguageDto {
  @IsNumber()
  @IsNotEmpty()
  languageId: number;

  @IsEnum(Level)
  @IsNotEmpty()
  level: Level;
}
