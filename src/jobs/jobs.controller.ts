import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserRoles } from '../auth/decorators/role.decorator';
import { Roles } from '../utils/enums.utils';
import { RolesGuard } from '../auth/guard/roles.guard';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @UserRoles(Roles.JOB_SEEKER, Roles.EMPLOYER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllJobs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.jobsService.getAllJobs(page, limit);
  }

  @UserRoles(Roles.JOB_SEEKER, Roles.EMPLOYER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getJobById(@Param('id') id: string) {
    return this.jobsService.getJobById(id);
  }

  @UserRoles(Roles.EMPLOYER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createJob(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.createJob(createJobDto);
  }

  @UserRoles(Roles.EMPLOYER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateJob(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.updateJob(id, updateJobDto);
  }

  @UserRoles(Roles.EMPLOYER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteJob(@Param('id') id: string) {
    return this.jobsService.deleteJob(id);
  }
}
