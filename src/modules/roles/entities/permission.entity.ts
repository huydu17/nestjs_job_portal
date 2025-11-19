import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from './role.entity';
import { Resource } from '@roles/enums/resource.enum';
import { Action } from '@roles/enums/action.enum';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({
    type: 'enum',
    enum: Resource,
  })
  resource: Resource;
  @Column('simple-array')
  actions: Action[];

  @Column()
  roleId: number;

  @ManyToOne(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
