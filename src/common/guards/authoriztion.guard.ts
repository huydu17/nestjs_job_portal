/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  Permission,
  PERMISSIONS_KEY,
} from '../decorators/permission.decorator';
import { UserService } from '@users/user.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id as number;
    if (!userId) {
      throw new UnauthorizedException('UserId not found');
    }
    const routePermissions: Permission[] = this.reflector.getAllAndOverride(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!routePermissions) {
      return true;
    }
    try {
      const userPermissions = await this.userService.getUserPermissions(userId);
      if (!userPermissions) {
        throw new ForbiddenException();
      }
      for (const routePerm of routePermissions) {
        const userPerm = userPermissions.find(
          (perm: any) => perm.resource === routePerm.resource,
        );
        if (!userPerm) {
          throw new ForbiddenException();
        }
        const allActionsAvailable = routePerm.actions.every((action) =>
          userPerm.actions.includes(action),
        );
        if (!allActionsAvailable) throw new ForbiddenException();
      }
    } catch (err) {
      throw new ForbiddenException(err);
    }
    return true;
  }
}
