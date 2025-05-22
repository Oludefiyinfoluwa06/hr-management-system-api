import { IsNotEmpty } from "class-validator";

export class ScheduleDto {
  @IsNotEmpty()
  applicationId: string;

  @IsNotEmpty()
  meetingTime: Date;

  @IsNotEmpty()
  meetingLink: string;
}
