import { BaseEntity } from 'src/common/entities/base.entity';
import { Benefit } from 'src/modules/benefits/entities/benefit.entity';
import { Job } from 'src/modules/jobs/entities/job.entity';
import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';

@Entity('job_benefits')
export class JobBenefit extends BaseEntity {
  @Column()
  jobId: number;

  @Column()
  benefitId: number;

  @ManyToOne(() => Job, (job) => job.jobBenefits)
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @ManyToOne(() => Benefit, (benefit) => benefit.jobBenefits)
  @JoinColumn({ name: 'benefitId' })
  benefit: Benefit;
}
