import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { RequestUser } from '../auth/interfaces/request-user.interface.js';
import { PossessionService } from './possession.service.js';
import { RecordPossessionDto } from './dto/record-possession.dto.js';

@Controller('possession')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PossessionController {
  constructor(private readonly possessionService: PossessionService) {}

  @Get()
  list(@Query('projectId') projectId: string) {
    return this.possessionService.findAllForProject(projectId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.possessionService.findOne(id);
  }

  @Post()
  @Roles(Role.FIELD_OFFICER, Role.DISTRICT_OFFICER, Role.ADMIN)
  record(@Body() dto: RecordPossessionDto, @CurrentUser() user: RequestUser) {
    return this.possessionService.record(dto, user);
  }

  @Patch(':id/verify')
  @Roles(Role.DISTRICT_OFFICER, Role.STATE_OFFICER, Role.ADMIN)
  verify(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.possessionService.verify(id, user);
  }
}
