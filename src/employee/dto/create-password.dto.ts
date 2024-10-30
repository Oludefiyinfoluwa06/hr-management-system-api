import { IsNotEmpty, Matches } from 'class-validator';

export class CreatePasswordDto {
  @IsNotEmpty({ message: 'Enter a company ID' })
  readonly companyId: string;

  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
    message: `Password must be at least 8 characters long
    and contain at least one uppercase letter,
    one lowercase letter, one digit and one special character`,
  })
  password: string;
}
