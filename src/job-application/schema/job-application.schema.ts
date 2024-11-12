import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from '../../user/schema/user.schema';
import { Job } from '../../job/schema/job.schema';
import { ApplicationStatus } from '../../utils/enums.utils';

@Schema()
export class JobApplication extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  applicantId: Types.ObjectId;

  @Prop({ required: true })
  companyId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Job.name })
  jobId: Types.ObjectId;

  @Prop({ required: true })
  coverLetter: string;

  @Prop({ required: true, enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus;
}

export const JobApplicationSchema = SchemaFactory.createForClass(JobApplication);
