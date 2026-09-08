import { Module } from '@nestjs/common';
import { CompensationController } from './compensation.controller.js';
import { CompensationService } from './compensation.service.js';

@Module({
  controllers: [CompensationController],
  providers: [CompensationService],
  exports: [CompensationService],
})
export class CompensationModule {}
