import { BaseEntity } from 'src/common/entities/base.entity';
import { CandidateSkill } from 'src/modules/candidate-skills/entities/candidate-skill.entity';
import { JobSkill } from 'src/modules/jobs/entities/job-skill.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('skills')
export class Skill extends BaseEntity {
  @Column({ type: 'nvarchar', unique: true })
  name: string;

  @OneToMany(() => CandidateSkill, (cs) => cs.skill)
  candidateSkills: CandidateSkill[];

  @OneToMany(() => JobSkill, (js) => js.skill)
  jobSkills: JobSkill[];
}
