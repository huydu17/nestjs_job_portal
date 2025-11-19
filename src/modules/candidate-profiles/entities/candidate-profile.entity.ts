import { User } from '@users/entities/user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Gender } from 'src/common/enums/gender.enum';
import { Application } from 'src/modules/applications/entities/application.entity';
import { CandidateEducation } from 'src/modules/candidate-educations/entities/candidate-education.entity';
import { CandidateExperience } from 'src/modules/candidate-experiences/entities/candidate-experience.entity';
import { CandidateLanguage } from 'src/modules/candidate-languages/entities/candidate-language.entity';
import { CandidateSkill } from 'src/modules/candidate-skills/entities/candidate-skill.entity';
import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('candidate_profiles')
export class CandidateProfile extends BaseEntity {
  @Column()
  fullName: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column()
  phone: string;

  @Column({
    nullable: true,
  })
  cvUrl?: string;

  @Column({
    nullable: true,
  })
  cvPublicId?: string;

  @Column({ type: 'date' })
  birthdate: Date;

  @Column()
  address: string;

  @Column({ default: false })
  openToWork: boolean;

  @Column({ default: true })
  status: boolean;

  @Column()
  userId: number;

  @OneToOne(() => User, (user) => user.candidateProfile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(
    () => CandidateLanguage,
    (candidateLanguage) => candidateLanguage.candidateProfile,
  )
  candidateLanguages: CandidateLanguage[];

  @OneToMany(
    () => CandidateEducation,
    (candidateEducation) => candidateEducation.candidateProfile,
  )
  candidateEducations: CandidateEducation[];

  @OneToMany(
    () => CandidateSkill,
    (candidateSkill) => candidateSkill.candidateProfile,
  )
  candidateSkills: CandidateSkill[];

  @OneToMany(
    () => CandidateExperience,
    (candidateExperience) => candidateExperience.candidateProfile,
  )
  candidateExperiences: CandidateExperience[];

  @OneToMany(() => Application, (apply) => apply.candidateProfile)
  applications: Application[];
}
