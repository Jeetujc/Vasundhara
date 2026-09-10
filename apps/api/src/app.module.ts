import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module.js';
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
import { LocationsModule } from './location/location.module.js';
import { AdminUsersModule } from './admin/admin-user.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { GrievancesModule } from './grievances/grievances.module.js';
import { DocumentsModule } from './documents/documents.module.js';
import { GisModule } from './gis/gis.module.js';
import { AiModule } from './ai/ai.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
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
    LocationsModule,
    AdminUsersModule,
    DashboardModule,
    GrievancesModule,
    DocumentsModule,
    GisModule,
    AiModule,
  ],
})
export class AppModule {
  // constructor() {
  //   console.log('TEST_ENV:', process.env.TEST_ENV);
  //   console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  // }
}