import { IsEnum, IsNotEmpty } from 'class-validator';
import { JobStatus } from 'src/common/enums/job-status.enum';

export class UpdateJobStatusDto {
  @IsEnum(JobStatus)
  @IsNotEmpty()
  status: JobStatus;
}
