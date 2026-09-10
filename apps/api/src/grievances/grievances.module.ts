import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GrievancesController } from './grievances.controller.js';
import { GrievancesService } from './grievances.service.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { AuditModule } from '../audit/audit.module.js';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    NotificationsModule,
    AuditModule,
  ],
  controllers: [GrievancesController],
  providers: [GrievancesService],
  exports: [GrievancesService],
})
export class GrievancesModule {}
