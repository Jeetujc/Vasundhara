import { RrStatus } from '../../generated/prisma/client.js';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateRrCaseDto {
  @IsOptional()
  @IsEnum(RrStatus)
  status?: RrStatus;

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
