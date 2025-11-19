import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsInt,
  IsArray,
} from 'class-validator';

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minSalary?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxSalary?: number;

  @IsInt()
  @IsArray()
  @IsOptional()
  skillIds?: number[];

  @IsInt()
  @IsArray()
  @IsOptional()
  benefitIds?: number[];
}
