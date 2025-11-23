/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Expose, Transform } from 'class-transformer';
import { ApplyStatus } from 'src/common/enums/apply-status.enum';

export class ApplicationDetailResponseDto {
  @Expose()
  jobId: number;

  @Expose()
  @Transform(({ obj }) => obj.job?.title)
  jobTitle: string;

  @Expose()
  @Transform(({ obj }) => obj.job?.company?.name)
  companyName: string;

  @Expose()
  candidateProfileId: number;

  @Expose()
  @Transform(({ obj }) => obj.candidateProfile?.fullName)
  candidateName: string;

  @Expose()
  @Transform(({ obj }) => obj.candidateProfile?.user?.email)
  candidateEmail: string;

  @Expose()
  @Transform(({ obj }) => obj.candidateProfile?.cvUrl)
  cvUrl: string;

  @Expose()
  @Transform(({ obj }) => obj.candidateProfile?.phone)
  phone: string;

  @Expose()
  status: ApplyStatus;

  @Expose()
  applyDate: Date;
}

export class CandidateApplicationResponseDto {
  @Expose()
  jobId: number;

  @Expose()
  @Transform(({ obj }) => obj.job?.title)
  jobTitle: string;

  @Expose()
  @Transform(({ obj }) => obj.job?.company?.name)
  companyName: string;

  @Expose()
  @Transform(({ obj }) => obj.job?.company?.companyImages?.[0]?.imageUrl)
  companyLogo: string;

  @Expose()
  @Transform(({ obj }) => obj.job?.city)
  city: string;

  @Expose()
  @Transform(({ obj }) => obj.job?.maxSalary)
  maxSalary: number;

  @Expose()
  status: ApplyStatus;

  @Expose()
  applyDate: Date;
}

export class RecruiterApplicationResponseDto {
  @Expose()
  candidateProfileId: number;

  @Expose()
  jobId: number;

  @Expose()
  @Transform(({ obj }) => obj.job?.title)
  jobTitle: string;

  @Expose()
  @Transform(({ obj }) => obj.candidateProfile?.fullName)
  candidateName: string;

  @Expose()
  @Transform(({ obj }) => obj.candidateProfile?.user?.email)
  candidateEmail: string;

  @Expose()
  @Transform(({ obj }) => obj.candidateProfile?.phone)
  candidatePhone: string;

  @Expose()
  @Transform(({ obj }) => obj.candidateProfile?.cvUrl)
  cvUrl: string;

  @Expose()
  status: ApplyStatus;

  @Expose()
  applyDate: Date;
}
