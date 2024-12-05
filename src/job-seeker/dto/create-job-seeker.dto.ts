import { IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { EducationalLevels } from '../../utils/enums.utils';

export class CreateJobSeekerDto {
  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  location?: string;

  @IsOptional()
  linkedInProfile?: string;

  @IsNotEmpty()
  professionalSummary: string;

  @IsEnum(EducationalLevels)
  @IsNotEmpty()
  educationalLevel: EducationalLevels;

  @IsOptional()
  profilePicture?: string;
}
