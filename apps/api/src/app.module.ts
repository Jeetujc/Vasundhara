import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { ParcelsModule } from './land-parcels/land-parcels.module.js';
import { WorkflowModule } from './workflow/workflow.module.js';
import { CompensationModule } from './compensation/compensation.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProjectsModule,
    ParcelsModule,
    WorkflowModule,
    CompensationModule,
    NotificationsModule,
  ],
})
export class AppModule {}