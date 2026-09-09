import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateParcelDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  parcelNumber!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  surveyNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  village?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  tehsil?: string;

  @IsOptional()
  @IsString()
  area?: string;
}
