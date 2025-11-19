import { BaseEntity } from 'src/common/entities/base.entity';
import { Job } from 'src/modules/jobs/entities/job.entity';
import { Skill } from 'src/modules/skills/entities/skill.entity';
import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';

@Entity('job_skills')
export class JobSkill extends BaseEntity {
  @Column()
  jobId: number;

  @Column()
  skillId: number;

  @ManyToOne(() => Job, (job) => job.jobSkills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @ManyToOne(() => Skill, (skill) => skill.jobSkills)
  @JoinColumn({ name: 'skillId' })
  skill: Skill;
}
