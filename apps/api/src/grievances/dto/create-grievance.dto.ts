import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGrievanceDto {
  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  khasraNo?: string;

  @IsString()
  @IsOptional()
  evidenceUrl?: string;
}
