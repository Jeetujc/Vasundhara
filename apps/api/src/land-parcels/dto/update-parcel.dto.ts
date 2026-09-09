import { ParcelStatus } from '../../generated/prisma/client.js';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateParcelDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  parcelNumber?: string;

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

  @IsOptional()
  @IsEnum(ParcelStatus)
  status?: ParcelStatus;
}
