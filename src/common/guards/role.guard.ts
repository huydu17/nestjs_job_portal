/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException, // 👈 Import cái này
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@roles/enums/role.enum';
import { ROLE } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>(ROLE, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userRoles = request?.user?.roles;
    if (!userRoles || !Array.isArray(userRoles)) {
      throw new ForbiddenException('User roles not found or invalid');
    }
    const hasRole = roles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this record',
      );
    }
    return true;
  }
}
