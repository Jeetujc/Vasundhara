import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GrievanceStatus } from '../../generated/prisma/client.js';

export class UpdateGrievanceDto {
  @IsEnum(GrievanceStatus)
  status!: GrievanceStatus;

  @IsString()
  @IsOptional()
  resolution?: string;
}
