import { User } from '@users/entities/user.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { Package } from 'src/modules/packages/entities/package.entity';
import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'date' })
  orderDate: Date;

  @Column()
  recruiterId: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'recruiterId' })
  recruiter: User;

  @Column()
  packageId: number;

  @ManyToOne(() => Package, (packageEntity) => packageEntity.orders)
  @JoinColumn({ name: 'packageId' })
  package: Package;

  @BeforeInsert()
  setOrderDate() {
    this.orderDate = new Date();
  }
}
