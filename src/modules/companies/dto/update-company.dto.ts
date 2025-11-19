import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  Min,
  IsArray,
  IsInt,
} from 'class-validator';

export class UpdateCompanyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  teamSize?: number;

  @IsDateString()
  @IsOptional()
  establishmentDate?: string;

  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @IsString()
  @IsOptional()
  mapLink?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsArray()
  @IsInt()
  @IsOptional()
  industryIds?: number[];
}
