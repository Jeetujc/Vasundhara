import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module.js';
import { RolesGuard } from '../common/roles.guard.js';
import { RrController } from './rr.controller.js';
import { RrService } from './rr.service.js';

@Module({
  imports: [AuditModule],
  controllers: [RrController],
  providers: [RrService, RolesGuard],
  exports: [RrService],
})
export class RrModule {}
