import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { AuditService } from './audit.service.js';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.CENTRAL_OFFICER)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  list(@Query('projectId') projectId?: string) {
    return this.auditService.findMany(projectId);
  }
}
