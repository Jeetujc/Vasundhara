import { Injectable, NotFoundException } from '@nestjs/common';
import { RrStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import type { RequestUser } from '../auth/interfaces/request-user.interface.js';
import type { CreateRrCaseDto } from './dto/create-rr-case.dto.js';

@Injectable()
export class RehabilitationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAllForProject(projectId: string) {
    return this.prisma.rrCase.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const rrCase = await this.prisma.rrCase.findUnique({ where: { id } });
    if (!rrCase) {
      throw new NotFoundException('R&R case not found');
    }
    return rrCase;
  }

  async create(dto: CreateRrCaseDto, user: RequestUser) {
    const rrCase = await this.prisma.rrCase.create({
      data: { ...dto, assessedAt: new Date() },
    });

    await this.audit.log({
      userId: user.userId,
      action: 'RR_CASE_CREATED',
      entityType: 'RrCase',
      entityId: rrCase.id,
      projectId: dto.projectId,
      familyId: dto.familyId,
      rrCaseId: rrCase.id,
    });

    return rrCase;
  }

  async close(id: string, user: RequestUser) {
    const existing = await this.findOne(id);

    const updated = await this.prisma.rrCase.update({
      where: { id },
      data: { status: RrStatus.CLOSED, completedAt: new Date() },
    });

    await this.audit.log({
      userId: user.userId,
      action: 'RR_CASE_CLOSED',
      entityType: 'RrCase',
      entityId: id,
      projectId: existing.projectId,
      familyId: existing.familyId,
      rrCaseId: id,
    });

    return updated;
  }
}
