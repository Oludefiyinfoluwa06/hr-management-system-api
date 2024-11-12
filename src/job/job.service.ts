import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from './schema/job.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobService {
  constructor(@InjectModel(Job.name) private jobModel: Model<Job>) {}

  async getAllJobs(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [results, totalItems] = await Promise.all([
      this.jobModel.find().skip(skip).limit(limit),
      this.jobModel.countDocuments(),
    ]);

    return {
      results,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };
  }

  async getJobById(id: string) {
    const job = await this.jobModel.findById(id);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async createJob(createJobDto: CreateJobDto, authUser: any) {
    const newJob = new this.jobModel({ ...createJobDto, companyId: authUser.companyId });
    return newJob.save();
  }

  async updateJob(id: string, updateJobDto: UpdateJobDto) {
    const job = await this.jobModel.findById(id);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return await this.jobModel.findByIdAndUpdate(id, updateJobDto, { new: true });
  }

  async deleteJob(id: string) {
    return await this.jobModel.findByIdAndDelete(id);
  }
}
