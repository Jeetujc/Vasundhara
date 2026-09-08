import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { RequestUser } from '../auth/interfaces/request-user.interface.js';
import { RehabilitationService } from './rehabilitation.service.js';
import { CreateRrCaseDto } from './dto/create-rr-case.dto.js';

@Controller('rr-cases')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RehabilitationController {
  constructor(private readonly rehabilitationService: RehabilitationService) {}

  @Get()
  list(@Query('projectId') projectId: string) {
    return this.rehabilitationService.findAllForProject(projectId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.rehabilitationService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.DISTRICT_OFFICER, Role.STATE_OFFICER)
  create(@Body() dto: CreateRrCaseDto, @CurrentUser() user: RequestUser) {
    return this.rehabilitationService.create(dto, user);
  }

  @Patch(':id/close')
  @Roles(Role.ADMIN, Role.DISTRICT_OFFICER, Role.STATE_OFFICER)
  close(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.rehabilitationService.close(id, user);
  }
}
