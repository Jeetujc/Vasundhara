import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RrStatus } from '../generated/prisma/client.js';
import { AuditService } from '../audit/audit.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRrCaseDto } from './dto/create-rr-case.dto.js';
import { UpdateRrCaseDto } from './dto/update-rr-case.dto.js';

@Injectable()
export class RrService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  list(projectId?: string, familyId?: string, status?: RrStatus) {
    return this.prisma.rrCase.findMany({
      where: {
        projectId,
        familyId,
        status,
      },
      include: {
        project: { select: { id: true, name: true, code: true } },
        family: { select: { id: true, familyReference: true, headOfFamily: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateRrCaseDto, actorId?: string) {
    const family = await this.prisma.affectedFamily.findUnique({
      where: { id: dto.familyId },
      select: { id: true, projectId: true, displaced: true },
    });

    if (!family || family.projectId !== dto.projectId) {
      throw new BadRequestException('Family is not linked to project');
    }

    if (!family.displaced) {
      throw new BadRequestException('R&R case can only be created for displaced families');
    }

    const created = await this.prisma.rrCase.create({
      data: {
        projectId: dto.projectId,
        familyId: dto.familyId,
        status: RrStatus.ASSESSED,
        housingSupport: dto.housingSupport ?? false,
        financialAssistance: dto.financialAssistance ?? false,
        employmentSupport: dto.employmentSupport ?? false,
        relocationSupport: dto.relocationSupport ?? false,
        benefitsDescription: dto.benefitsDescription,
        assessedAt: new Date(),
      },
    });

    await this.auditService.create({
      action: 'RR_CASE_CREATED',
      entityType: 'RrCase',
      entityId: created.id,
      userId: actorId,
      projectId: dto.projectId,
      familyId: dto.familyId,
      rrCaseId: created.id,
      description: 'R&R case created',
    });

    return created;
  }

  async update(id: string, dto: UpdateRrCaseDto, actorId?: string) {
    const existing = await this.prisma.rrCase.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('R&R case not found');
    }

    const status = dto.status ?? existing.status;

    const updated = await this.prisma.rrCase.update({
      where: { id },
      data: {
        status,
        housingSupport: dto.housingSupport ?? existing.housingSupport,
        financialAssistance: dto.financialAssistance ?? existing.financialAssistance,
        employmentSupport: dto.employmentSupport ?? existing.employmentSupport,
        relocationSupport: dto.relocationSupport ?? existing.relocationSupport,
        benefitsDescription: dto.benefitsDescription ?? existing.benefitsDescription,
        verifiedAt:
          status === RrStatus.VERIFICATION_PENDING || status === RrStatus.CLOSED
            ? new Date()
            : existing.verifiedAt,
        completedAt:
          status === RrStatus.COMPLETED || status === RrStatus.CLOSED
            ? new Date()
            : existing.completedAt,
      },
    });

    await this.auditService.create({
      action: 'RR_CASE_UPDATED',
      entityType: 'RrCase',
      entityId: id,
      userId: actorId,
      projectId: updated.projectId,
      familyId: updated.familyId,
      rrCaseId: id,
      description: 'R&R case updated',
      metadata: {
        status,
      },
    });

    return updated;
  }
}
