import { IsNotEmpty } from 'class-validator';

export class RequestOtpDto {
  @IsNotEmpty()
  email: string;
}
