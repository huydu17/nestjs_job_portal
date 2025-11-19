import { IsNumber, IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { Degree } from 'src/common/enums/degree.enum';

export class CreateCandidateEducationDto {
  @IsString()
  @IsNotEmpty()
  educationName: string;

  @IsString()
  @IsNotEmpty()
  major: string;

  @IsEnum(Degree)
  @IsNotEmpty()
  degree: Degree;

  @IsNumber()
  @IsNotEmpty()
  yearStart: number;

  @IsNumber()
  @IsNotEmpty()
  yearEnd: number;
}
