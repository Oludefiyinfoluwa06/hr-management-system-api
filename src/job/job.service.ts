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
      totalItems,
    };
  }

  async getCompanyJobs(authUser: any, page: number = 1, limit: number = 10) {
    const skip = (Number(page) - 1) * limit;

    const [results, totalItems] = await Promise.all([
      this.jobModel.find({ companyId: authUser.companyId }).skip(skip).limit(limit),
      this.jobModel.countDocuments({ companyId: authUser.companyId }),
    ]);

    return {
      results,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      totalItems,
    };
  }

  async getAllCompanyJobs(authUser: any) {
    return await this.jobModel.find({ companyId: authUser.companyId });
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

  async searchJobs(
    title: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const currentPage = Math.max(1, Number(page) || 1);
    const perPage = Math.max(1, Math.min(Number(limit) || 10, 100));

    const skip = (currentPage - 1) * perPage;

    const filter = {
      title: { $regex: title.trim(), $options: 'i' },
    };

    const [results, totalItems] = await Promise.all([
      this.jobModel
        .find(filter)
        .skip(skip)
        .limit(perPage)
        .lean(),
      this.jobModel.countDocuments(filter),
    ]);

    if (results.length === 0) {
      throw new NotFoundException(`No jobs found matching "${title}"`);
    }

    return {
      results,
      totalPages: Math.ceil(totalItems / perPage),
      currentPage,
      totalItems,
    };
  }

  async deleteJob(id: string) {
    return await this.jobModel.findByIdAndDelete(id);
  }
}
