import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AuditService } from './audit.service.js';

@Controller('audit')
@UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  list(
    @Query('projectId') projectId?: string,
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
  ) {
    return this.auditService.list(projectId, entityType, entityId);
  }
}
