import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Job title',
    example: 'Senior Backend Developer (NodeJS/NestJS)',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Full job description (supports HTML content)',
    example: '<p>We are looking for a talented developer...</p>',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    enum: JobLevel,
    description: 'Job seniority level',
    example: JobLevel.SENIOR,
  })
  @IsEnum(JobLevel)
  level: JobLevel;

  @ApiProperty({
    enum: JobType,
    description: 'Type of employment',
    example: JobType.FULL_TIME,
  })
  @IsEnum(JobType)
  jobType: JobType;

  @ApiProperty({
    description: 'Minimum salary offering',
    minimum: 0,
    example: 1000,
  })
  @IsNumber()
  @Min(0)
  minSalary: number;

  @ApiPropertyOptional({
    description: 'Maximum salary offering (Optional)',
    minimum: 0,
    example: 3000,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxSalary?: number;

  @ApiProperty({
    description: 'City where the job is located',
    example: 'Ho Chi Minh City',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({
    description: 'Specific work address',
    example: 'Lot E3, D1 Street, High Tech Park, District 9',
  })
  @IsString()
  @IsOptional()
  workAddress?: string;

  @ApiProperty({
    description: 'Application deadline (ISO 8601 format)',
    example: '2025-12-31T23:59:59.000Z',
  })
  @Type(() => Date) // Chuyển string từ JSON sang Date object
  @IsDate()
  @MinDate(new Date(), { message: 'Deadline must be in the future' })
  deadline: Date;

  @ApiProperty({
    description: 'List of Skill IDs required for the job',
    type: [Number],
    example: [1, 2, 5],
  })
  @IsArray()
  @IsInt({ each: true })
  skillIds: number[];

  @ApiPropertyOptional({
    description: 'List of Benefit IDs offered (Optional)',
    type: [Number],
    example: [1, 3],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  benefitIds?: number[];
}
