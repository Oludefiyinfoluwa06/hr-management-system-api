import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EmploymentType } from '../../utils/enums.utils';

@Schema()
export class Job extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, enum: EmploymentType })
  employmentType: EmploymentType;

  @Prop({ required: true })
  salaryMin: number;

  @Prop({ required: true })
  salaryMax: number;

  @Prop({ required: true })
  description: string;

  @Prop({ default: false })
  remote: boolean;

  @Prop({ required: true })
  companyId: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
