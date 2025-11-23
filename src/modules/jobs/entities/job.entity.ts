import { User } from '@users/entities/user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { JobStatus } from 'src/common/enums/job-status.enum';
import { Application } from 'src/modules/applications/entities/application.entity';
import { Company } from 'src/modules/companies/entities/company.entity';

import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { JobLevel, JobType } from '../enums/job.enum';
import { JobSkill } from './job-skill.entity';
import { JobBenefit } from './job-benefit.entity';

@Entity('jobs')
export class Job extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: JobLevel,
  })
  level: JobLevel;

  @Column({
    type: 'enum',
    enum: JobType,
    default: JobType.FULL_TIME,
  })
  jobType: JobType;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.ACTIVE,
  })
  status: JobStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  minSalary: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxSalary: number;

  @Column({ default: 0 })
  totalViews: number;

  @Column({ default: 0 })
  totalApplications: number;

  @Column()
  city: string;

  @Column({ nullable: true })
  workAddress: string;

  @Column({ type: 'datetime' })
  deadline: Date;

  @Column()
  companyId: number;

  @ManyToOne(() => Company, (company) => company.jobs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ nullable: true })
  postById: number;

  @ManyToOne(() => User, (user) => user.jobs, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'postById' })
  postBy: User;

  @OneToMany(() => JobSkill, (jobSkill) => jobSkill.job, {
    cascade: true,
  })
  jobSkills: JobSkill[];

  @OneToMany(() => JobBenefit, (jobBenefit) => jobBenefit.job, {
    cascade: true,
  })
  jobBenefits: JobBenefit[];

  @OneToMany(() => Application, (apply) => apply.job)
  applications: Application[];

  @DeleteDateColumn()
  deletedAt: Date;
}
