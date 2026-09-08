import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { CompensationStatus, PaymentStatus } from '@prisma/client';

export class UpdateCompensationDto {
  @IsOptional()
  @IsEnum(CompensationStatus)
  status?: CompensationStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsNumberString()
  approvedAmount?: string;

  @IsOptional()
  @IsNumberString()
  paidAmount?: string;
}
