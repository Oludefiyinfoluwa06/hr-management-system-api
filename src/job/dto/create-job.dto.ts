import { IsNotEmpty, IsEnum, IsNumber, Min } from 'class-validator';
import { EmploymentType } from '../../utils/enums.utils';

export class CreateJobDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  location: string;

  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @IsNumber()
  @Min(0)
  salaryMin: number;

  @IsNumber()
  @Min(0)
  salaryMax: number;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  remote: boolean;
}
