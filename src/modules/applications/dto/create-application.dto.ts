import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
  @IsNumber()
  @IsNotEmpty()
  jobId: number;
}
