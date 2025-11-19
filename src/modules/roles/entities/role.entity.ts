import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Permission } from './permission.entity';
import { UserRole } from 'src/modules/user-roles/entities/user-role.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column()
  name: string;
  @Column()
  description: string;
  @Column({ default: false })
  isSystem: boolean;
  @OneToMany(() => Permission, (permission) => permission.role)
  permissions: Permission[];
  @OneToMany(() => UserRole, (ur) => ur.role)
  users: UserRole[];
}
