import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  Min,
  IsInt,
} from 'class-validator';

export class CreatePackageDto {
  @ApiProperty({
    description: 'Name of the service package',
    example: 'Premium Package (30 Days)',
  })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({
    description: 'Price of the package (0 if free)',
    example: 100.0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Total number of job posts allowed',
    example: 10,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  jobPostLimit: number;

  @ApiProperty({
    description: 'Validity period of the package in days',
    example: 30,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    description: 'Status of the package (true = available for purchase)',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
