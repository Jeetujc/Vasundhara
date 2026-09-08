import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CompleteTaskDto {
  @IsOptional()
  @IsString()
  nextAssignedToId?: string;

  @IsOptional()
  @IsDateString()
  nextDeadline?: string;
}
