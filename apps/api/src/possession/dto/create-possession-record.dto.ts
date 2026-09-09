import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePossessionRecordDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  parcelId!: string;

  @IsOptional()
  @IsString()
  fieldOfficerId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}
