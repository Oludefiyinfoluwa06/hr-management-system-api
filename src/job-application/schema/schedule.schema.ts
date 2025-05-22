import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { JobSeeker } from '../../job-seeker/schema/job-seeker.schema';
import { JobApplication } from './job-application.schema';

@Schema()
export class InterviewSchedule extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: JobSeeker.name })
  applicantId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: JobApplication.name })
  applicationId: Types.ObjectId;

  @Prop()
  meetingTime: Date;

  @Prop()
  meetingLink: string;
}

export const InterviewScheduleSchema = SchemaFactory.createForClass(InterviewSchedule);
