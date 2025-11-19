import { SetMetadata } from '@nestjs/common';
import { Action } from '@roles/enums/action.enum';
import { Resource } from '@roles/enums/resource.enum';

export const PERMISSIONS_KEY = 'permissions';

export interface Permission {
  resource: Resource;
  actions: Action[];
}

export const Permissions = (permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
