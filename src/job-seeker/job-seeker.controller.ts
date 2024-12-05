import { Controller, Get, Post, Body, Put, UseGuards } from '@nestjs/common';
import { JobSeekerService } from './job-seeker.service';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('job-seeker')
export class JobSeekerController {
  constructor(private readonly jobSeekerService: JobSeekerService) {}

  @Post()
  async create(
    @AuthUser() authUser: any,
    @Body() createJobSeekerDto: CreateJobSeekerDto
  ) {
    return this.jobSeekerService.create(authUser, createJobSeekerDto);
  }

  @Get()
  async findOne(@AuthUser() authUser: any) {
    return this.jobSeekerService.findOne(authUser);
  }

  @Put()
  async update(
    @AuthUser() authUser: any,
    @Body() updateJobSeekerDto: UpdateJobSeekerDto,
  ) {
    return this.jobSeekerService.update(authUser, updateJobSeekerDto);
  }
}
