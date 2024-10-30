import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EducationalLevels, Roles } from '../../utils/enums.utils';

export class EmployeeDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  physicalAddress: string;

  @IsEmail()
  emailAddress: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsNotEmpty()
  emergencyPhoneNumber: string;

  @IsNotEmpty()
  @IsEnum(EducationalLevels)
  educationalLevel: EducationalLevels;

  @IsNotEmpty()
  employmentRole: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  employmentStartDate: Date;

  @IsNotEmpty()
  bankName: string;

  @IsNotEmpty()
  bankAccountNumber: number;

  @IsNotEmpty()
  bankAccountName: string;

  @IsNotEmpty()
  nextOfKinFullName: string;

  @IsNotEmpty()
  nextOfKinPhoneNumber: string;

  @IsNotEmpty()
  nextOfKinRelationship: string;
}
