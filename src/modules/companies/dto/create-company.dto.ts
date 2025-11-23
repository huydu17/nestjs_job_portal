import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsNotEmpty,
  Min,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'The official name of the company',
    example: 'FPT Software',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Detailed introduction about the company, mission, and vision',
    example:
      'FPT Software is a global leading technology and IT services provider...',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Total number of employees',
    example: 1000,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  teamSize: number;

  @ApiProperty({
    description: 'The date when the company was established (ISO 8601 format)',
    example: '1999-01-13',
  })
  @IsDateString()
  @IsNotEmpty()
  establishmentDate: string;

  @ApiProperty({
    description: 'Headquarters address',
    example: 'Hola Park, Hoa Lac Hi-Tech Park',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'City or Province where the company is located',
    example: 'Hanoi',
  })
  @IsString()
  city: string;

  @ApiPropertyOptional({
    description: 'Official website URL',
    example: 'https://fpt-software.com',
  })
  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @ApiPropertyOptional({
    description: 'Google Maps embed link or URL',
    example: 'https://goo.gl/maps/example',
  })
  @IsString()
  @IsOptional()
  mapLink?: string;

  @ApiProperty({
    description: 'List of Industry IDs related to the company operations',
    type: [Number],
    example: [1, 5],
  })
  @IsArray()
  @IsInt({ each: true })
  industryIds: number[];
}
