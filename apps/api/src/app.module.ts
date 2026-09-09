import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { ParcelsModule } from './land-parcels/land-parcels.module.js';
import { WorkflowModule } from './workflow/workflow.module.js';
import { CompensationModule } from './compensation/compensation.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { PossessionModule } from './possession/possession.module.js';
import { RrModule } from './rr/rr.module.js';
import { AuditModule } from './audit/audit.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule,
    UsersModule,
    ProjectsModule,
    ParcelsModule,
    WorkflowModule,
    CompensationModule,
    PossessionModule,
    RrModule,
    NotificationsModule,
    AuditModule,
  ],
})
export class AppModule {
  // constructor() {
  //   console.log('TEST_ENV:', process.env.TEST_ENV);
  //   console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  // }
}