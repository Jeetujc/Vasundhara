import { Module } from '@nestjs/common';
import { ParcelsController } from './land-parcels.controller.js';
import { ParcelsService } from './land-parcels.service.js';

@Module({
  controllers: [ParcelsController],
  providers: [ParcelsService],
  exports: [ParcelsService],
})
export class ParcelsModule {}
