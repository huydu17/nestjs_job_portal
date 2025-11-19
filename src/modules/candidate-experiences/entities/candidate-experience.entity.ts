import { BaseEntity } from 'src/common/entities/base.entity';
import { CandidateProfile } from 'src/modules/candidate-profiles/entities/candidate-profile.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('candidate_experiences')
export class CandidateExperience extends BaseEntity {
  @Column()
  company: string;

  @Column()
  department: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date | null;

  @Column({ type: 'text' })
  responsibilities: string;

  @Column()
  candidateProfileId: number;

  @ManyToOne(
    () => CandidateProfile,
    (candidateProfile) => candidateProfile.candidateExperiences,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'candidateProfileId' })
  candidateProfile: CandidateProfile;
}
