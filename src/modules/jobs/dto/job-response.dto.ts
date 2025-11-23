/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Expose, Transform, Type } from 'class-transformer';
import { JobLevel, JobType } from '../enums/job.enum';
import { JobStatus } from 'src/common/enums/job-status.enum';

class JobSkillResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

class JobBenefitResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

class JobCompanyResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ obj }) => obj.companyImages?.[0]?.imageUrl)
  logoUrl: string;
}

export class JobResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  @Transform(({ obj }) => obj?.postBy?.name)
  postBy: string;

  @Expose()
  city: string;

  @Expose()
  workAddress: string;

  @Expose()
  level: JobLevel;

  @Expose()
  jobType: JobType;

  @Expose()
  status: JobStatus;

  @Expose()
  minSalary: number;

  @Expose()
  maxSalary: number;

  @Expose()
  deadline: Date;

  @Expose()
  totalViews: number;

  @Expose()
  totalApplications: number;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => JobCompanyResponseDto)
  company: JobCompanyResponseDto;

  @Expose()
  @Type(() => JobSkillResponseDto)
  @Transform(({ obj }) => {
    return obj.jobSkills?.map((jobSkill: any) => ({
      id: jobSkill.skill?.id,
      name: jobSkill.skill?.name,
    }));
  })
  skills: JobSkillResponseDto[];

  @Expose()
  @Type(() => JobBenefitResponseDto)
  @Transform(({ obj }) => {
    return obj.jobBenefits?.map((jobBenefit: any) => ({
      id: jobBenefit.benefit?.id,
      name: jobBenefit.benefit?.name,
    }));
  })
  benefits: JobBenefitResponseDto[];
}
