import { Module } from '@nestjs/common';
import { PossessionController } from './possession.controller.js';
import { PossessionService } from './possession.service.js';

@Module({
  controllers: [PossessionController],
  providers: [PossessionService],
  exports: [PossessionService],
})
export class PossessionModule {}
