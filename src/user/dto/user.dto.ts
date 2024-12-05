import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Roles } from '../../utils/enums.utils';

export class UserDto {
  @IsOptional()
  companyName: string;

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

  @IsOptional()
  @Type(() => Number)
  otp: number;

  @IsOptional()
  @Type(() => Date)
  otpExpires: Date;
}
