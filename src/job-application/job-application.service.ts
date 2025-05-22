import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JobApplication } from './schema/job-application.schema';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { Job } from '../job/schema/job.schema';
import { JobSeeker } from '../job-seeker/schema/job-seeker.schema';
import { User } from '../user/schema/user.schema';
import { ScheduleDto } from './dto/schedule.dto';
import { InterviewSchedule } from './schema/schedule.schema';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectModel(JobApplication.name) private jobApplicationModel: Model<JobApplication>,
    @InjectModel(Job.name) private jobModel: Model<Job>,
    @InjectModel(JobSeeker.name) private jobSeekerModel: Model<JobSeeker>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(InterviewSchedule.name) private interviewScheduleModel: Model<InterviewSchedule>,
  ) {}

  async getAllApplications(authUser: any) {
    const user = await this.userModel.findById(authUser.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const jobSeeker = await this.jobSeekerModel.findOne({ userId: authUser.userId });

    if (!jobSeeker) {
      throw new NotFoundException('Set up your profile');
    }

    return await this.jobApplicationModel
      .find({ applicantId: jobSeeker._id })
      .populate([{ path: 'jobId', select: 'title location employmentType remote' }, { path: 'applicantId' }]);
  }

  async getCompanyApplications(authUser: any) {
    return this.jobApplicationModel
      .find({ companyId: authUser.companyId, isArchived: false })
      .lean()
      .populate([
        { path: 'jobId', select: 'title location employmentType remote' },
        { path: 'applicantId', select: 'fullName email' }
      ]);
  }

  async getApplicationById(id: string) {
    const application = await this.jobApplicationModel.findById(id).populate('applicantId');

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async getApplicationsByJob(jobId: string) {
    return await this.jobApplicationModel.find({ jobId: new Types.ObjectId(jobId), isArchived: false }).populate('applicantId');
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
      applicantId: jobSeeker._id,
      jobId: createJobApplicationDto.jobId,
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied to this job');
    }

    const newApplication = new this.jobApplicationModel({
      ...createJobApplicationDto,
      applicantId: new Types.ObjectId(String(jobSeeker._id)),
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

  async scheduleMeeting(dto: ScheduleDto) {
    const application = await this.jobApplicationModel.findById(dto.applicationId).populate('applicantId jobId');

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const schedule = await this.interviewScheduleModel.create({
      applicantId: application.applicantId,
      applicationId: application._id,
      meetingTime: dto.meetingTime,
      meetingLink: dto.meetingLink,
    });

    return { message: 'Interview schedule saved', schedule };
  }

  async getScheduledMeetings(authUser: any) {
    const jobSeeker = await this.jobSeekerModel.findOne({ userId: authUser.userId });

    if (!jobSeeker) {
      throw new NotFoundException('Set up your profile');
    }

    const schedules = await this.interviewScheduleModel
      .find({ applicantId: jobSeeker._id })
      .populate({
        path: 'applicationId',
        populate: {
          path: 'jobId',
          select: 'title companyName location employmentType',
        },
      })
      .exec();

    if (!schedules) {
      throw new NotFoundException('There are scheduled interviews');
    }

    return schedules;
  }

  async archiveOrReacceptApplication(applicationId: string, isArchived: boolean) {
    const application = await this.jobApplicationModel.findById(applicationId);

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return await this.jobApplicationModel.findByIdAndUpdate(applicationId, { isArchived }, { new: true });
  }

  async getArchivedApplications(authUser: any) {
    return this.jobApplicationModel
      .find({ companyId: authUser.companyId, isArchived: true })
      .lean()
      .populate([
        { path: 'jobId', select: 'title location employmentType remote' },
        { path: 'applicantId', select: 'fullName email' }
      ]);
  }
}
