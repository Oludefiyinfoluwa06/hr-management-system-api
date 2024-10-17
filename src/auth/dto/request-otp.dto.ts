import { IsEnum, IsNotEmpty } from 'class-validator';
import { Roles } from '../../utils/enums.utils';

export class RequestOtpDto {
  @IsNotEmpty()
  email: string;

  @IsEnum(Roles)
  role: Roles;
}
