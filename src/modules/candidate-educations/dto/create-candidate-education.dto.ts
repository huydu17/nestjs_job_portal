import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { Degree } from 'src/common/enums/degree.enum';

export class CreateCandidateEducationDto {
  @ApiProperty({
    description: 'The name of the school, university, or institution',
    example: 'Da Nang University of Science and Technology',
  })
  @IsString()
  @IsNotEmpty()
  educationName: string;

  @ApiProperty({
    description: 'The major or field of study',
    example: 'Software Engineering',
  })
  @IsString()
  @IsNotEmpty()
  major: string;

  @ApiProperty({
    enum: Degree,
    description: 'The degree level obtained',
    example: Degree.BACHELOR,
  })
  @IsEnum(Degree)
  @IsNotEmpty()
  degree: Degree;

  @ApiProperty({
    description: 'The year the education started',
    example: 2020,
  })
  @IsNumber()
  @IsNotEmpty()
  yearStart: number;

  @ApiProperty({
    description: 'The year of graduation (or expected graduation)',
    example: 2025,
  })
  @IsNumber()
  @IsNotEmpty()
  yearEnd: number;
}
