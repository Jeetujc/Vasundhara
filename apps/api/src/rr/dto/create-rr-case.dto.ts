import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRrCaseDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
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
  @MaxLength(1000)
  benefitsDescription?: string;
}
