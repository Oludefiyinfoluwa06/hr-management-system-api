import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './schema/job.schema';
import { JobService } from './job.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
    ]),
  ],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
