import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CompleteTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;

  @IsOptional()
  @IsString()
  nextAssignedToId?: string;

  @IsOptional()
  @IsString()
  nextDeadline?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  actorId?: string;
}
