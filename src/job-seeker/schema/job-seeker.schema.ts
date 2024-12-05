import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { EducationalLevels } from '../../utils/enums.utils';
import { User } from '../../user/schema/user.schema';

@Schema({ timestamps: true })
export class JobSeeker extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  location: string;

  @Prop()
  linkedInProfile: string;

  @Prop()
  professionalSummary: string;

  @Prop()
  educationalLevel: EducationalLevels;

  @Prop()
  profilePicture: string;
}

export const JobSeekerSchema = SchemaFactory.createForClass(JobSeeker);
