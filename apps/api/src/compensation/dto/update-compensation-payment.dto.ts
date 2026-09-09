import { PaymentStatus } from '../../generated/prisma/client.js';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCompensationPaymentDto {
  @IsOptional()
  @IsString()
  paidAmount?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsOptional()
  @IsBoolean()
  markVerified?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}
