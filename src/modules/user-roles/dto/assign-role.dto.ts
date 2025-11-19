import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class AssignRoleDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  roleIds: number[];
}
