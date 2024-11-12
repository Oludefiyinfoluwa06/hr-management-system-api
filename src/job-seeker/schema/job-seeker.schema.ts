import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { EducationalLevels } from '../../utils/enums.utils';
import { User } from '../../user/schema/user.schema';

@Schema({ timestamps: true })
export class JobSeeker extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  phoneNumber: string;

  @Prop({ type: String })
  location: string;

  @Prop({ type: String })
  linkedInProfile: string;

  @Prop({ type: String, required: true })
  professionalSummary: string;

  @Prop({ type: String, required: true, enum: EducationalLevels })
  educationalLevel: EducationalLevels;
}

export const JobSeekerSchema = SchemaFactory.createForClass(JobSeeker);
