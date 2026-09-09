import { Module } from '@nestjs/common';
import { RolesGuard } from '../common/roles.guard.js';
import { ParcelsController } from './land-parcels.controller.js';
import { ParcelsService } from './land-parcels.service.js';

@Module({
  controllers: [ParcelsController],
  providers: [ParcelsService, RolesGuard],
  exports: [ParcelsService],
})
export class ParcelsModule {}
