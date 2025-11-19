import { IsString, IsEnum, IsDateString, IsNotEmpty } from 'class-validator';
import { Gender } from 'src/common/enums/gender.enum';

export class CreateCandidateProfileDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsDateString()
  @IsNotEmpty()
  birthdate: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
