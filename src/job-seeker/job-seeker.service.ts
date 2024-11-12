import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobSeeker } from './schema/job-seeker.schema';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';

@Injectable()
export class JobSeekerService {
  constructor(
    @InjectModel(JobSeeker.name) private jobSeekerModel: Model<JobSeeker>,
  ) {}

  async create(authUser: any, createJobSeekerDto: CreateJobSeekerDto) {
    const existingJobSeeker = await this.jobSeekerModel.findOne({ email: createJobSeekerDto.email });

    if (existingJobSeeker) {
      throw new ConflictException('An account with this email exists already');
    }

    const newJobSeeker = await this.jobSeekerModel.create({
      ...createJobSeekerDto,
      userId: authUser.userId,
    });

    if (!newJobSeeker) {
      throw new BadRequestException('Could not create profile');
    }

    return newJobSeeker;
  }

  async findOne(authUser: any) {
    const jobSeeker = await this.jobSeekerModel.findOne({ userId: authUser.userId });

    if (!jobSeeker) {
      throw new NotFoundException('Profile does not exist');
    }

    return jobSeeker;
  }

  async update(authUser: any, updateJobSeekerDto: UpdateJobSeekerDto) {
    const updatedJobSeeker = await this.jobSeekerModel.findOneAndUpdate(
      { userId: authUser.userId },
      updateJobSeekerDto,
      { new: true },
    );
    if (!updatedJobSeeker) {
      throw new NotFoundException('Profile does not exist');
    }
    return updatedJobSeeker;
  }
}
