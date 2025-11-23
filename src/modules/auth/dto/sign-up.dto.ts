/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@roles/enums/role.enum';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  ValidateIf,
  Equals,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
    minLength: 2,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'A unique email address',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'P@ssword123',
    description:
      'User password (6-32 characters, must contain uppercase, lowercase, and number)',
    minLength: 6,
    maxLength: 32,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @ApiProperty({
    example: 'P@ssword123',
    description: 'Repeat the password to confirm',
  })
  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.password !== o.confirmPassword)
  @Equals(null, { message: 'Passwords do not match' })
  confirmPassword: string;

  @ApiPropertyOptional({
    enum: Role,
    example: Role.CANDIDATE,
    description: 'The role of the user (Default is CANDIDATE)',
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
