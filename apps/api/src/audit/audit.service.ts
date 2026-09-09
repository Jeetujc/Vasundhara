import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

interface CreateAuditInput {
  action: string;
  entityType: string;
  entityId: string;
  description?: string;
  userId?: string;
  projectId?: string;
  parcelId?: string;
  compensationId?: string;
  possessionId?: string;
  rrCaseId?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateAuditInput) {
    return this.prisma.auditLog.create({
      data: input,
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
