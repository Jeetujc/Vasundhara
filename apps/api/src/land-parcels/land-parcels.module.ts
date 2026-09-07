import { Module } from '@nestjs/common';
import { ParcelsController } from './land-parcels.controller.js';

@Module({
  controllers: [ParcelsController],
})
export class ParcelsModule {}