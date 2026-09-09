import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module.js';
import { RolesGuard } from '../common/roles.guard.js';
import { CompensationController } from './compensation.controller.js';
import { CompensationService } from './compensation.service.js';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [AuditModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [CompensationController],
  providers: [CompensationService, RolesGuard],
  exports: [CompensationService],
})
export class CompensationModule {}
