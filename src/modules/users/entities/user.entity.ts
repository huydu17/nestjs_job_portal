import { BaseEntity } from 'src/common/entities/base.entity';
import { CandidateProfile } from 'src/modules/candidate-profiles/entities/candidate-profile.entity';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Job } from 'src/modules/jobs/entities/job.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { RecruiterPackage } from 'src/modules/recruiter-packages/entities/recruiter-package.entity';
import { UserRole } from 'src/modules/user-roles/entities/user-role.entity';
import { Entity, Column, OneToOne, OneToMany } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @OneToMany(() => UserRole, (ur) => ur.user)
  roles: UserRole[];

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @OneToOne(() => CandidateProfile, (profile) => profile.user)
  candidateProfile: CandidateProfile;

  @OneToMany(() => Company, (company) => company.user)
  companies: Company[];

  @OneToMany(() => Job, (job) => job.postBy)
  jobs: Job[];

  @OneToMany(() => RecruiterPackage, (rp) => rp.recruiter)
  recruiterPackages: RecruiterPackage[];

  @OneToMany(() => Order, (order) => order.recruiter)
  orders: Order[];
}
