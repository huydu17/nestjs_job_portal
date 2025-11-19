import {
  IsString,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Gender } from 'src/common/enums/gender.enum';

export class UpdateCandidateProfileDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  cv?: string;

  @IsDateString()
  @IsOptional()
  birthdate?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsBoolean()
  @IsOptional()
  openToWork?: boolean;
}
