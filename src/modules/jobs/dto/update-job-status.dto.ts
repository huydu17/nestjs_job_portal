import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { JobStatus } from 'src/common/enums/job-status.enum';

export class UpdateJobStatusDto {
  @ApiProperty({
    enum: JobStatus,
    description: 'Status of job',
    example: JobStatus.CLOSED,
  })
  @IsEnum(JobStatus)
  @IsNotEmpty()
  status: JobStatus;
}
