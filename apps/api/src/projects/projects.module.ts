import { Module } from '@nestjs/common';
import { RolesGuard } from '../common/roles.guard.js';
import { ProjectsController } from './projects.controller.js';
import { ProjectsService } from './projects.service.js';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, RolesGuard],
  exports: [ProjectsService],
})
export class ProjectsModule {}
