import { Body, Controller, Get, Post, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ScheduleDto } from './dto/schedule.dto';

@Controller('job-applications')
export class JobApplicationController {
  constructor(private jobApplicationService: JobApplicationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllApplications(@AuthUser() authUser: any) {
    return this.jobApplicationService.getAllApplications(authUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('company')
  getCompanyApplications(@AuthUser() authUser: any) {
    return this.jobApplicationService.getCompanyApplications(authUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('schedule')
  getScheduledMeetings(@AuthUser() authUser: any) {
    return this.jobApplicationService.getScheduledMeetings(authUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('archives')
  getArchivedApplications(@AuthUser() authUser: any) {
    return this.jobApplicationService.getArchivedApplications(authUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getApplicationById(@Param('id') id: string) {
    return this.jobApplicationService.getApplicationById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('job/:jobId')
  getApplicationsByJob(@Param('jobId') jobId: string) {
    return this.jobApplicationService.getApplicationsByJob(jobId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createApplication(
    @Body() createJobApplicationDto: CreateJobApplicationDto,
    @AuthUser() authUser: any
  ) {
    return this.jobApplicationService.createApplication(authUser, createJobApplicationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('schedule')
  scheduleMeeting(@Body() dto: ScheduleDto) {
    return this.jobApplicationService.scheduleMeeting(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('archives/:applicationId')
  archiveOrReacceptApplication(
    @Param('applicationId') applicationId: string,
    @Body('isArchived') isArchived: boolean,
  ) {
    return this.jobApplicationService.archiveOrReacceptApplication(applicationId, isArchived);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateApplication(
    @Param('id') id: string,
    @Body() updateJobApplicationDto: UpdateJobApplicationDto,
  ) {
    return this.jobApplicationService.updateApplication(id, updateJobApplicationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteApplication(@Param('id') id: string) {
    return this.jobApplicationService.deleteApplication(id);
  }
}
