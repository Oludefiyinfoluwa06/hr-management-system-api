import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JobApplication } from './schema/job-application.schema';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { Job } from '../job/schema/job.schema';
import { JobSeeker } from '../job-seeker/schema/job-seeker.schema';
import { User } from '../user/schema/user.schema';
import { JobSeekerService } from '../job-seeker/job-seeker.service';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectModel(JobApplication.name) private jobApplicationModel: Model<JobApplication>,
    @InjectModel(Job.name) private jobModel: Model<Job>,
    @InjectModel(JobSeeker.name) private jobSeekerModel: Model<JobSeeker>,
    @InjectModel(User.name) private userModel: Model<User>,
    private jobSeekerService: JobSeekerService,
  ) {}

  async getAllApplications(authUser: any) {
    const jobSeeker = await this.jobSeekerService.findOne(authUser);
    return await this.jobApplicationModel
      .find({ applicantId: jobSeeker.userId })
      .populate([{ path: 'jobId', select: 'title location employmentType remote' }]);
  }

  async getCompanyApplications(authUser: any) {
    return await this.jobApplicationModel
      .find({ companyId: authUser.companyId })
      .populate([{ path: 'jobId', select: 'title location employmentType remote' }]);
  }

  async getApplicationById(id: string) {
    const application = await this.jobApplicationModel.findById(id);

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async getApplicationsByJob(jobId: string) {
    return await this.jobApplicationModel.find({ jobId: new Types.ObjectId(jobId) });
  }

  async createApplication(
    authUser: any,
    createJobApplicationDto: CreateJobApplicationDto
  ) {
    const job = await this.jobModel.findById(createJobApplicationDto.jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const user = await this.userModel.findById(authUser.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const jobSeeker = await this.jobSeekerModel.findOne({ userId: authUser.userId });

    if (!jobSeeker) {
      throw new NotFoundException('Set up your profile');
    }

    const existingApplication = await this.jobApplicationModel.findOne({
      applicantId: authUser.userId,
      jobId: createJobApplicationDto.jobId,
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied to this job');
    }

    const newApplication = new this.jobApplicationModel({
      ...createJobApplicationDto,
      applicantId: new Types.ObjectId(authUser.userId),
      jobId: new Types.ObjectId(createJobApplicationDto.jobId),
    });

    return newApplication.save();
  }

  async updateApplication(id: string, updateJobApplicationDto: UpdateJobApplicationDto) {
    const application = await this.jobApplicationModel.findByIdAndUpdate(
      id,
      updateJobApplicationDto,
      { new: true }
    );

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async deleteApplication(id: string) {
    const application = await this.jobApplicationModel.findByIdAndDelete(id);

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return { message: 'Application deleted successfully' };
  }
}
