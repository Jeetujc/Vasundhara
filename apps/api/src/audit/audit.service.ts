import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

interface CreateAuditInput {
  action: string;
  entityType: string;
  entityId: string;
  description?: string;
  userId?: string;
  projectId?: string;
  parcelId?: string;
  familyId?: string;
  compensationId?: string;
  possessionId?: string;
  rrCaseId?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateAuditInput) {
    const data: Prisma.AuditLogUncheckedCreateInput = {
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      description: input.description,
      metadata: (input.metadata as Prisma.InputJsonValue | undefined) ?? undefined,
      userId: input.userId ?? null,
      projectId: input.projectId ?? null,
      parcelId: input.parcelId ?? null,
      familyId: input.familyId ?? null,
      compensationId: input.compensationId ?? null,
      possessionId: input.possessionId ?? null,
      rrCaseId: input.rrCaseId ?? null,
    };

    return this.prisma.auditLog.create({
      data,
    });
  }

  list(projectId?: string, entityType?: string, entityId?: string) {
    return this.prisma.auditLog.findMany({
      where: {
        projectId,
        entityType,
        entityId,
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }
}
