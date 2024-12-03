import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  industry: string;

  @IsNotEmpty()
  founded: string;

  @IsNotEmpty()
  size: string;

  @IsNotEmpty()
  location: string;

  @IsUrl()
  website: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  mission: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;
}
