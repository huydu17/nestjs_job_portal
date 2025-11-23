import { SetMetadata } from '@nestjs/common';
import { Role } from '@roles/enums/role.enum';

export const ROLE = 'roles';

export const Roles = (...roles: Role[]) => SetMetadata(ROLE, roles);
