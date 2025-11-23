import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsDateString, IsNotEmpty } from 'class-validator';
import { Gender } from 'src/common/enums/gender.enum';

export class CreateCandidateProfileDto {
  @ApiProperty({
    description: 'Full name of the candidate',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Gender of the candidate',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    description: 'Contact phone number',
    example: '0901234567',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Date of birth (ISO-8601 format: YYYY-MM-DD)',
    example: '2000-01-01',
    type: String,
    format: 'date',
  })
  @IsDateString()
  @IsNotEmpty()
  birthdate: string;

  @ApiProperty({
    description: 'Permanent address',
    example: '123 Main Street, New York, NY',
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}
