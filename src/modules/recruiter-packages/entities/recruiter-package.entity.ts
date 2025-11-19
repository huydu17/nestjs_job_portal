import { User } from '@users/entities/user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Package } from 'src/modules/packages/entities/package.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('recruiter_packages')
export class RecruiterPackage extends BaseEntity {
  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column()
  remainingPost: number;

  @Column()
  recruiterId: number;

  @ManyToOne(() => User, (user) => user.recruiterPackages)
  @JoinColumn({ name: 'recruiterId' })
  recruiter: User;

  @Column()
  packageId: number;

  @ManyToOne(() => Package, (packageEntity) => packageEntity.recruiterPackages)
  @JoinColumn({ name: 'packageId' })
  package: Package;
}
