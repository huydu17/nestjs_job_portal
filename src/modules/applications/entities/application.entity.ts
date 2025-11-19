import { ApplyStatus } from 'src/common/enums/apply-status.enum';
import { CandidateProfile } from 'src/modules/candidate-profiles/entities/candidate-profile.entity';
import { Job } from 'src/modules/jobs/entities/job.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('applications')
export class Application {
  @PrimaryColumn()
  candidateProfileId: number;

  @PrimaryColumn()
  jobId: number;

  @Column({
    type: 'enum',
    enum: ApplyStatus,
    default: ApplyStatus.PENDING,
  })
  status: ApplyStatus;

  @CreateDateColumn()
  applyDate: Date;

  @ManyToOne(
    () => CandidateProfile,
    (candidateProfile) => candidateProfile.applications,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'candidateProfileId' })
  candidateProfile: CandidateProfile;

  @ManyToOne(() => Job, (job) => job.applications)
  @JoinColumn({ name: 'jobId' })
  job: Job;
}
