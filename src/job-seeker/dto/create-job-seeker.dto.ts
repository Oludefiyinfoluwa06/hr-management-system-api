import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { EducationalLevels } from '../../utils/enums.utils';

export class CreateJobSeekerDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  location?: string;

  @IsString()
  linkedInProfile?: string;

  @IsString()
  @IsNotEmpty()
  professionalSummary: string;

  @IsEnum(EducationalLevels)
  @IsNotEmpty()
  educationalLevel: EducationalLevels;
}
