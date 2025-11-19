import { IsArray, IsEnum } from 'class-validator';
import { Action } from '../enums/action.enum';
import { Resource } from '../enums/resource.enum';

export class PermissionDto {
  @IsEnum(Resource)
  resource: Resource;

  @IsArray()
  @IsEnum(Action, { each: true })
  actions: Action[];
}
