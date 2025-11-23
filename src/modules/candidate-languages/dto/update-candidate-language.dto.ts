import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Level } from 'src/common/enums/level.enum';

export class UpdateCandidateLanguageDto {
  @ApiProperty({
    enum: Level,
    description: 'Proficiency level in this language',
    example: Level.BASIC,
  })
  @IsEnum(Level)
  @IsNotEmpty()
  level: Level;
}
