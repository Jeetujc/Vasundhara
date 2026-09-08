import { IsLatitude, IsLongitude, IsOptional, IsString } from 'class-validator';

export class RecordPossessionDto {
  @IsString()
  projectId!: string;

  @IsString()
  parcelId!: string;

  @IsOptional()
  @IsString()
  fieldOfficerId?: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsString()
  evidenceUrl?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
