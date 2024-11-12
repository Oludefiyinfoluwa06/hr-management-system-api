import { IsNotEmpty } from "class-validator";

export class CreateJobApplicationDto {
  @IsNotEmpty()
  jobId: string;

  @IsNotEmpty()
  companyId: string;

  @IsNotEmpty()
  coverLetter: string;
}
