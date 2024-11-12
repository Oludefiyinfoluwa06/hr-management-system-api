import { Module } from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { JobApplicationController } from './job-application.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JobApplication, JobApplicationSchema } from './schema/job-application.schema';
import { User, UserSchema } from '../user/schema/user.schema';
import { Job, JobSchema } from '../job/schema/job.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobApplication.name, schema: JobApplicationSchema },
      { name: Job.name, schema: JobSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [JobApplicationController],
  providers: [JobApplicationService],
})
export class JobApplicationModule {}
