import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ApproveCompanyDto {
  @IsBoolean()
  @IsNotEmpty()
  isApproved: boolean;
}


