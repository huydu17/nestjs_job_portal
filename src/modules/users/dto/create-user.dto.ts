import { Role } from '@roles/enums/role.enum';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsEnum(Role)
  @IsNotEmpty()
  @IsOptional()
  role?: Role;
}
