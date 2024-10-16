import { IsEmail, IsEnum, IsNotEmpty, Matches } from 'class-validator';
import { Roles } from '../../utils/enums.utils';

export class RegisterDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
    message: `Password must be at least 8 characters long
    and contain at least one uppercase letter,
    one lowercase letter, one digit and one special character`,
  })
  password: string;

  @IsNotEmpty()
  @IsEnum(Roles)
  role: Roles;
}
