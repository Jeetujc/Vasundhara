import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StartWorkflowDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsOptional()
  @IsString()
  assignedToId?: string;

  @IsOptional()
  @IsString()
  deadline?: string;
}
