import { Module } from '@nestjs/common';
import { RehabilitationController } from './rehabilitation.controller.js';
import { RehabilitationService } from './rehabilitation.service.js';

@Module({
  controllers: [RehabilitationController],
  providers: [RehabilitationService],
  exports: [RehabilitationService],
})
export class RehabilitationModule {}
