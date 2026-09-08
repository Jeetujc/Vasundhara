import { IsDateString, IsOptional, IsString } from 'class-validator';

export class StartWorkflowDto {
  @IsString()
  projectId!: string;

  @IsOptional()
  @IsString()
  assignedToId?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}
