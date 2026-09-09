import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module.js';
import { RolesGuard } from '../common/roles.guard.js';
import { RrController } from './rr.controller.js';
import { RrService } from './rr.service.js';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AuditModule,PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [RrController],
  providers: [RrService, RolesGuard],
  exports: [RrService],
})
export class RrModule {}
