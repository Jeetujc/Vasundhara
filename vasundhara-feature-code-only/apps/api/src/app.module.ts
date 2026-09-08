import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module.js';
import { AuditModule } from './audit/audit.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { ParcelsModule } from './land-parcels/land-parcels.module.js';
import { FamiliesModule } from './families/families.module.js';
import { WorkflowModule } from './workflow/workflow.module.js';
import { CompensationModule } from './compensation/compensation.module.js';
import { PossessionModule } from './possession/possession.module.js';
import { RehabilitationModule } from './rehabilitation/rehabilitation.module.js';
import { DocumentsModule } from './documents/documents.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { GisModule } from './gis/gis.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { ReportsModule } from './reports/reports.module.js';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    ParcelsModule,
    FamiliesModule,
    WorkflowModule,
    CompensationModule,
    PossessionModule,
    RehabilitationModule,
    DocumentsModule,
    NotificationsModule,
    GisModule,
    DashboardModule,
    ReportsModule,
  ],
})
export class AppModule {}