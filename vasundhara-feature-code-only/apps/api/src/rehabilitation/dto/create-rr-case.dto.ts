import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateRrCaseDto {
  @IsString()
  projectId!: string;

  @IsString()
  familyId!: string;

  @IsOptional()
  @IsBoolean()
  housingSupport?: boolean;

  @IsOptional()
  @IsBoolean()
  financialAssistance?: boolean;

  @IsOptional()
  @IsBoolean()
  employmentSupport?: boolean;

  @IsOptional()
  @IsBoolean()
  relocationSupport?: boolean;

  @IsOptional()
  @IsString()
  benefitsDescription?: string;
}
