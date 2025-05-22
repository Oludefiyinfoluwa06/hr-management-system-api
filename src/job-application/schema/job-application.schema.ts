import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { JobSeeker } from '../../job-seeker/schema/job-seeker.schema';
import { Job } from '../../job/schema/job.schema';

@Schema()
export class JobApplication extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: JobSeeker.name })
  applicantId: Types.ObjectId;

  @Prop()
  companyId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Job.name })
  jobId: Types.ObjectId;

  @Prop()
  coverLetter: string;

  @Prop()
  resumeLink: string;

  @Prop({ default: false })
  isArchived: boolean;
}

export const JobApplicationSchema = SchemaFactory.createForClass(JobApplication);
