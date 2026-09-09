import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module.js';
import { RolesGuard } from '../common/roles.guard.js';
import { PossessionController } from './possession.controller.js';
import { PossessionService } from './possession.service.js';

@Module({
  imports: [AuditModule],
  controllers: [PossessionController],
  providers: [PossessionService, RolesGuard],
  exports: [PossessionService],
})
export class PossessionModule {}
