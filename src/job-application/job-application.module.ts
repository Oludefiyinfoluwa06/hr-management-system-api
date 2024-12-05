import { Module } from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { JobApplicationController } from './job-application.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JobApplication, JobApplicationSchema } from './schema/job-application.schema';
import { User, UserSchema } from '../user/schema/user.schema';
import { Job, JobSchema } from '../job/schema/job.schema';
import { JobSeeker, JobSeekerSchema } from '../job-seeker/schema/job-seeker.schema';
import { JobSeekerModule } from '../job-seeker/job-seeker.module';

@Module({
  imports: [
    JobSeekerModule,
    MongooseModule.forFeature([
      { name: JobApplication.name, schema: JobApplicationSchema },
      { name: Job.name, schema: JobSchema },
      { name: User.name, schema: UserSchema },
      { name: JobSeeker.name, schema: JobSeekerSchema },
    ]),
  ],
  controllers: [JobApplicationController],
  providers: [JobApplicationService],
})
export class JobApplicationModule {}
