import { Module } from '@nestjs/common';
import { LocationsController } from './location.controller.js';
import { LocationsService } from './locations.service.js';

@Module({
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}