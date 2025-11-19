import { User } from '@users/entities/user.entity';

export const sanitizeUser = (user: User, roles: string[]) => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    roles,
  };
};
