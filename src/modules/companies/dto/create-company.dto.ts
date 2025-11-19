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
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  teamSize: number;

  @IsDateString()
  @IsNotEmpty()
  establishmentDate: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @IsString()
  @IsOptional()
  mapLink?: string;

  @IsArray()
  @IsInt({ each: true })
  industryIds: number[];
}
