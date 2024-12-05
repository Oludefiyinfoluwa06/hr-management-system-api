import { PartialType } from '@nestjs/mapped-types';
import { CreateJobSeekerDto } from './create-job-seeker.dto';

export class UpdateJobSeekerDto extends PartialType(CreateJobSeekerDto) {}
