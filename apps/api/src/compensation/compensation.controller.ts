import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Role, CompensationStatus, PaymentStatus } from '../generated/prisma/client.js';
import { Roles } from '../common/roles.decorator.js';
import { RolesGuard } from '../common/roles.guard.js';
import { CompensationService } from './compensation.service.js';
import { CreateCompensationCaseDto } from './dto/create-compensation-case.dto.js';
import { UpdateCompensationPaymentDto } from './dto/update-compensation-payment.dto.js';

interface AuthUser {
  id: string;
}

@Controller('compensation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompensationController {
  constructor(private readonly compensationService: CompensationService) {}

  @Get()
  list(
    @Query('projectId') projectId?: string,
    @Query('status') status?: CompensationStatus,
    @Query('paymentStatus') paymentStatus?: PaymentStatus,
  ) {
    return this.compensationService.list(projectId, status, paymentStatus);
  }

  @Post()
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER, Role.DISTRICT_OFFICER)
  create(@Body() dto: CreateCompensationCaseDto, @CurrentUser() user: AuthUser) {
    return this.compensationService.create(dto, user.id);
  }

  @Patch(':id/payment')
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER, Role.DISTRICT_OFFICER)
  updatePayment(
    @Param('id') id: string,
    @Body() dto: UpdateCompensationPaymentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.compensationService.updatePayment(id, dto, user.id);
  }
}
