import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  IsInt,
} from 'class-validator';

export class UpdatePackageDto {
  @IsString()
  @IsOptional()
  label?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  jobPostLimit?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
