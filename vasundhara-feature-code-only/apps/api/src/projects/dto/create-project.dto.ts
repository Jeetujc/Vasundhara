import { IsDateString, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name!: string;

  @IsString()
  code!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  stateId!: string;

  @IsString()
  districtId!: string;

  @IsOptional()
  @IsNumberString()
  proposedArea?: string;

  @IsOptional()
  @IsDateString()
  proposalDate?: string;
}
