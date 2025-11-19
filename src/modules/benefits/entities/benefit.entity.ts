import { BaseEntity } from 'src/common/entities/base.entity';
import { JobBenefit } from 'src/modules/jobs/entities/job-benefit.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('benefits')
export class Benefit extends BaseEntity {
  @Column({ type: 'nvarchar', unique: true })
  name: string;

  @OneToMany(() => JobBenefit, (jb) => jb.benefit)
  jobBenefits: JobBenefit[];
}
