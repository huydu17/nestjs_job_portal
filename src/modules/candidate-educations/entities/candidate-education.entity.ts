import { BaseEntity } from 'src/common/entities/base.entity';
import { Degree } from 'src/common/enums/degree.enum';
import { CandidateProfile } from 'src/modules/candidate-profiles/entities/candidate-profile.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('candidate_educations')
export class CandidateEducation extends BaseEntity {
  @Column()
  educationName: string;

  @Column()
  major: string;

  @Column({
    type: 'enum',
    enum: Degree,
    default: Degree.BACHELOR,
  })
  degree: Degree;

  @Column()
  yearStart: number;

  @Column()
  yearEnd: number;

  @Column()
  candidateProfileId: number;

  @ManyToOne(
    () => CandidateProfile,
    (candidateProfile) => candidateProfile.candidateEducations,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'candidateProfileId' })
  candidateProfile: CandidateProfile;
}
