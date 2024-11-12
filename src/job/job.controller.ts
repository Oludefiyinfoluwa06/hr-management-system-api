import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserRoles } from '../auth/decorators/role.decorator';
import { Roles } from '../utils/enums.utils';
import { RolesGuard } from '../auth/guard/roles.guard';
import { JobService } from './job.service';
import { AuthUser } from '../auth/decorators/auth-user.decorator';

@Controller('job')
export class JobController {
  constructor(private jobService: JobService) {}

  @UserRoles(Roles.JOB_SEEKER, Roles.EMPLOYER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllJobs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.jobService.getAllJobs(page, limit);
  }

  @UserRoles(Roles.JOB_SEEKER, Roles.EMPLOYER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getJobById(@Param('id') id: string) {
    return this.jobService.getJobById(id);
  }

  @UserRoles(Roles.EMPLOYER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createJob(
    @Body() createJobDto: CreateJobDto,
    @AuthUser() authUser: any,
  ) {
    return this.jobService.createJob(createJobDto, authUser);
  }

  @UserRoles(Roles.EMPLOYER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateJob(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.updateJob(id, updateJobDto);
  }

  @UserRoles(Roles.EMPLOYER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteJob(@Param('id') id: string) {
    return this.jobService.deleteJob(id);
  }
}
