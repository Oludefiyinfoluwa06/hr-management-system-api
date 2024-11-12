import { Module } from '@nestjs/common';
import { JobSeekerService } from './job-seeker.service';
import { JobSeekerController } from './job-seeker.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSeeker, JobSeekerSchema } from './schema/job-seeker.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: JobSeeker.name, schema: JobSeekerSchema }
    ]),
  ],
  controllers: [JobSeekerController],
  providers: [JobSeekerService],
})
export class JobSeekerModule {}
