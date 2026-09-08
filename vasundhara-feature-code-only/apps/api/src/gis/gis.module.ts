import { Module } from '@nestjs/common';
import { GisController } from './gis.controller.js';
import { GisService } from './gis.service.js';

@Module({
  controllers: [GisController],
  providers: [GisService],
})
export class GisModule {}
