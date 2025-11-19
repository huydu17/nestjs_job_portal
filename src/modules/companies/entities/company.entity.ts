import { User } from '@users/entities/user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Job } from 'src/modules/jobs/entities/job.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CompanyIndustry } from './company-industry.entity';
import { CompanyImage } from './company-image.entity';

@Entity('companies')
export class Company extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 50 })
  teamSize: number;

  @Column({ type: 'date' })
  establishmentDate: Date;

  @Column({ default: 0 })
  views: number;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  websiteUrl: string;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ nullable: true })
  mapLink: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.companies)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => CompanyImage, (companyImage) => companyImage.company)
  companyImages: CompanyImage[];

  @OneToMany(
    () => CompanyIndustry,
    (companyIndustry) => companyIndustry.company,
    {
      cascade: true,
    },
  )
  companyIndustries: CompanyIndustry[];

  @OneToMany(() => Job, (job) => job.company)
  jobs: Job[];
}
