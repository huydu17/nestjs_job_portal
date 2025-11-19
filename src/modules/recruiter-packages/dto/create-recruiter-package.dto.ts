import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateRecruiterPackageDto {
  @IsNumber()
  @IsNotEmpty()
  packageId: number;
}
