import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { RequestUser } from '../auth/interfaces/request-user.interface.js';
import { CompensationService } from './compensation.service.js';
import { CreateCompensationDto } from './dto/create-compensation.dto.js';
import { UpdateCompensationDto } from './dto/update-compensation.dto.js';

@Controller('compensation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompensationController {
  constructor(private readonly compensationService: CompensationService) {}

  @Get()
  list(@Query('projectId') projectId: string) {
    return this.compensationService.findAllForProject(projectId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.compensationService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER, Role.DISTRICT_OFFICER)
  create(@Body() dto: CreateCompensationDto, @CurrentUser() user: RequestUser) {
    return this.compensationService.create(dto, user);
  }

  @Patch(':id/pay')
  @Roles(Role.ADMIN, Role.CENTRAL_OFFICER, Role.STATE_OFFICER, Role.DISTRICT_OFFICER)
  pay(
    @Param('id') id: string,
    @Body() dto: UpdateCompensationDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.compensationService.pay(id, dto, user);
  }
}
