import { BaseEntity } from 'src/common/entities/base.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { RecruiterPackage } from 'src/modules/recruiter-packages/entities/recruiter-package.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity('packages')
export class Package extends BaseEntity {
  @Column()
  label: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  jobPostLimit: number;

  @Column()
  duration: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(
    () => RecruiterPackage,
    (recruiterPackage) => recruiterPackage.package,
  )
  recruiterPackages: RecruiterPackage[];

  @OneToMany(() => Order, (order) => order.package)
  orders: Order[];
}
