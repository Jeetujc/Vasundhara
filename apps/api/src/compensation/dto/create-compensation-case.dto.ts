import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompensationCaseDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  parcelId!: string;

  @IsString()
  @IsNotEmpty()
  familyId!: string;

  @IsOptional()
  @IsString()
  assessedAmount?: string;

  @IsOptional()
  @IsString()
  approvedAmount?: string;
}
