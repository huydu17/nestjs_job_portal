import { BaseEntity } from 'src/common/entities/base.entity';
import { CandidateProfile } from 'src/modules/candidate-profiles/entities/candidate-profile.entity';
import { Skill } from 'src/modules/skills/entities/skill.entity';
import { Entity, ManyToOne, JoinColumn, Column, Unique } from 'typeorm';

@Entity('candidate_skills')
@Unique(['candidateProfileId', 'skillId'])
export class CandidateSkill extends BaseEntity {
  @Column()
  candidateProfileId: number;

  @Column()
  skillId: number;

  @ManyToOne(
    () => CandidateProfile,
    (candidateProfile) => candidateProfile.candidateSkills,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'candidateProfileId' })
  candidateProfile: CandidateProfile;

  @ManyToOne(() => Skill, (skill) => skill.candidateSkills)
  @JoinColumn({ name: 'skillId' })
  skill: Skill;
}
