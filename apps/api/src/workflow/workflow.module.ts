import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { RolesGuard } from '../common/roles.guard.js';
import { WorkflowController } from './workflow.controller.js';
import { WorkflowService } from './workflow.service.js';

@Module({
  imports: [AuditModule, NotificationsModule],
  controllers: [WorkflowController],
  providers: [WorkflowService, RolesGuard],
  exports: [WorkflowService],
})
export class WorkflowModule {}
