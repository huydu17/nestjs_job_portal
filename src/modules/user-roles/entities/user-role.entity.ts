import { Role } from '@roles/entities/role.entity';
import { User } from '@users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('user_roles')
export class UserRole {
  @PrimaryColumn()
  userId: number;
  @PrimaryColumn()
  roleId: number;

  @ManyToOne(() => User, (user) => user.roles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Role, (role) => role.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
