import {
  IsString,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  Min,
  IsInt,
} from 'class-validator';

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  jobPostLimit: number;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
