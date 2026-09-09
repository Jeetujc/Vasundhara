import { ParcelStatus } from '../../generated/prisma/client.js';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ListParcelsQueryDto {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsEnum(ParcelStatus)
  status?: ParcelStatus;
}
