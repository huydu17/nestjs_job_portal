import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Level } from 'src/common/enums/level.enum';

export class CreateCandidateLanguageDto {
  @ApiProperty({
    description:
      'The ID of the language from the master data (e.g., 1 for English, 2 for Japanese)',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  languageId: number;

  @ApiProperty({
    enum: Level,
    description: 'Proficiency level in this language',
    example: Level.BASIC,
  })
  @IsEnum(Level)
  @IsNotEmpty()
  level: Level;
}
