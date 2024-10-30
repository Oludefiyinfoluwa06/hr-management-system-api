import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { EducationalLevels } from '../../utils/enums.utils';

@Schema()
export class Employee extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  physicalAddress: string;

  @Prop({ required: true, unique: true })
  emailAddress: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true })
  emergencyPhoneNumber: string;

  @Prop({ required: true, enum: EducationalLevels })
  educationalLevel: EducationalLevels;

  @Prop({ required: true })
  employmentRole: string;

  @Prop({ required: true })
  employmentStartDate: Date;

  @Prop({ required: true })
  bankName: string;

  @Prop({ required: true })
  bankAccountNumber: number;

  @Prop({ required: true })
  bankAccountName: string;

  @Prop({ required: true })
  nextOfKinFullName: string;

  @Prop({ required: true })
  nextOfKinPhoneNumber: string;

  @Prop({ required: true })
  nextOfKinRelationship: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ default: '' })
  password: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
