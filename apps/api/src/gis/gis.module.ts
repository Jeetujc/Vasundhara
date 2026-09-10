import { Module } from '@nestjs/common';
import { GisController } from './gis.controller.js';
import { GisService } from './gis.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [GisController],
  providers: [GisService],
  exports: [GisService],
})
export class GisModule {}
