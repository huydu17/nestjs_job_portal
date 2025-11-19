import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinDate,
} from 'class-validator';
import { JobLevel, JobType } from '../enums/job.enum';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(JobLevel)
  level: JobLevel;

  @IsEnum(JobType)
  jobType: JobType;

  @IsNumber()
  @Min(0)
  minSalary: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxSalary?: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsOptional()
  workAddress?: string;

  @Type(() => Date)
  @IsDate()
  @MinDate(new Date())
  deadline: Date;

  @IsArray()
  @IsInt({ each: true })
  skillIds: number[];

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  benefitIds?: number[];
}
