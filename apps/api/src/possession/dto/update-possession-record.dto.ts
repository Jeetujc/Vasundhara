import { PossessionStatus } from '../../generated/prisma/client.js';
import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdatePossessionRecordDto {
  @IsOptional()
  @IsEnum(PossessionStatus)
  status?: PossessionStatus;

  @IsOptional()
  @IsLatitude()
  latitude?: string;

  @IsOptional()
  @IsLongitude()
  longitude?: string;

  @IsOptional()
  @IsString()
  evidenceUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}
