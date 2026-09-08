import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

export interface AuditLogInput {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  projectId?: string | null;
  parcelId?: string | null;
  familyId?: string | null;
  compensationId?: string | null;
  possessionId?: string | null;
  rrCaseId?: string | null;
  description?: string;
  metadata?: Prisma.InputJsonValue;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  log(input: AuditLogInput) {
    return this.prisma.auditLog.create({
      data: {
        userId: input.userId ?? undefined,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? undefined,
        projectId: input.projectId ?? undefined,
        parcelId: input.parcelId ?? undefined,
        familyId: input.familyId ?? undefined,
        compensationId: input.compensationId ?? undefined,
        possessionId: input.possessionId ?? undefined,
        rrCaseId: input.rrCaseId ?? undefined,
        description: input.description,
        metadata: input.metadata,
      },
    });
  }

  findMany(projectId?: string) {
    return this.prisma.auditLog.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }
}
