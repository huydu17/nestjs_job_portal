import { BaseEntity } from 'src/common/entities/base.entity';
import { Level } from 'src/common/enums/level.enum';
import { CandidateProfile } from 'src/modules/candidate-profiles/entities/candidate-profile.entity';
import { Language } from 'src/modules/languages/entities/language.entity';
import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';

@Entity('candidate_languages')
@Unique(['candidateProfileId', 'languageId'])
export class CandidateLanguage extends BaseEntity {
  @Column()
  candidateProfileId: number;

  @Column()
  languageId: number;

  @Column({
    type: 'enum',
    enum: Level,
    default: Level.BASIC,
  })
  level: Level;

  @ManyToOne(
    () => CandidateProfile,
    (candidateProfile) => candidateProfile.candidateLanguages,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'candidateProfileId' })
  candidateProfile: CandidateProfile;

  @ManyToOne(() => Language, (language) => language.candidateLanguages, {
    eager: true,
  })
  @JoinColumn({ name: 'languageId' })
  language: Language;
}
