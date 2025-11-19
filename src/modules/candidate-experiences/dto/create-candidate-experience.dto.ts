import {
  IsString,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  MaxDate,
} from 'class-validator';

export class CreateCandidateExperienceDto {
  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsDateString()
  @IsNotEmpty()
  @MaxDate(new Date(), {
    message: 'Start date cannot be greater than current date',
  })
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsNotEmpty()
  responsibilities: string;
}
