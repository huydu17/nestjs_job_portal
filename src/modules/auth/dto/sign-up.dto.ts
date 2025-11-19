import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  ValidateIf,
  Equals,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  password: string;

  @IsNotEmpty()
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((o) => o.password !== o.confirmPassword)
  @Equals(null, { message: 'Passwords do not match' })
  confirmPassword: string;
}
