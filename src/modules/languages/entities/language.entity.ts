import { BaseEntity } from 'src/common/entities/base.entity';
import { CandidateLanguage } from 'src/modules/candidate-languages/entities/candidate-language.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('languages')
export class Language extends BaseEntity {
  @Column({ type: 'nvarchar', unique: true })
  name: string;

  @OneToMany(() => CandidateLanguage, (cl) => cl.language)
  candidateLanguages: CandidateLanguage[];
}
