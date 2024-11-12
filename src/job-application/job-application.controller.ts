import { Body, Controller, Get, Post, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { UserRoles } from '../auth/decorators/role.decorator';
import { Roles } from '../utils/enums.utils';
import { RolesGuard } from '../auth/guard/roles.guard';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('job-applications')
export class JobApplicationController {
  constructor(private jobApplicationService: JobApplicationService) {}

  @UserRoles(Roles.JOB_SEEKER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllApplications(@AuthUser() authUser: any) {
    return this.jobApplicationService.getAllApplications(authUser);
  }

  @UserRoles(Roles.EMPLOYER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('/company')
  async getCompanyApplications(@AuthUser() authUser: any) {
    return this.jobApplicationService.getCompanyApplications(authUser);
  }

  @UserRoles(Roles.JOB_SEEKER, Roles.EMPLOYER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getApplicationById(@Param('id') id: string) {
    return this.jobApplicationService.getApplicationById(id);
  }

  @UserRoles(Roles.EMPLOYER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('job/:jobId')
  async getApplicationsByJob(@Param('jobId') jobId: string) {
    return this.jobApplicationService.getApplicationsByJob(jobId);
  }

  @UserRoles(Roles.JOB_SEEKER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createApplication(
    @Body() createJobApplicationDto: CreateJobApplicationDto,
    @AuthUser() authUser: any
  ) {
    return this.jobApplicationService.createApplication(authUser, createJobApplicationDto);
  }

  @UserRoles(Roles.EMPLOYER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateApplication(
    @Param('id') id: string,
    @Body() updateJobApplicationDto: UpdateJobApplicationDto,
  ) {
    return this.jobApplicationService.updateApplication(id, updateJobApplicationDto);
  }

  @UserRoles(Roles.JOB_SEEKER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteApplication(@Param('id') id: string) {
    return this.jobApplicationService.deleteApplication(id);
  }
}
