import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateCandidateExperienceDto {
  @ApiProperty({
    description: 'Name of the company',
    example: 'Google Inc.',
  })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({
    description: 'Job title or Department',
    example: 'Fresher Backend Engineer',
  })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({
    description: 'Start date of employment (ISO 8601 format)',
    example: '2022-01-01',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiPropertyOptional({
    description:
      'End date of employment. Leave empty or null if currently working there.',
    example: '2024-01-01',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: 'Key responsibilities and achievements during this role',
    example: 'Designed and implemented scalable RESTful APIs using NestJS...',
  })
  @IsString()
  @IsNotEmpty()
  responsibilities: string;
}
