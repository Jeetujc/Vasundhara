import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { RolesGuard } from '../common/roles.guard.js';

import { ProjectsController } from './projects.controller.js';
import { ProjectsService } from './projects.service.js';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [AuthModule,PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [ProjectsController],
  providers: [ProjectsService, RolesGuard],
  exports: [ProjectsService],
})
export class ProjectsModule {}