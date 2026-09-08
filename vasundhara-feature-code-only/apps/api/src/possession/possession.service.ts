import { Injectable, NotFoundException } from '@nestjs/common';
import { PossessionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import type { RequestUser } from '../auth/interfaces/request-user.interface.js';
import type { RecordPossessionDto } from './dto/record-possession.dto.js';

@Injectable()
export class PossessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAllForProject(projectId: string) {
    return this.prisma.possessionRecord.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.possessionRecord.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundException('Possession record not found');
    }
    return record;
  }

  async record(dto: RecordPossessionDto, user: RequestUser) {
    const record = await this.prisma.possessionRecord.create({
      data: {
        projectId: dto.projectId,
        parcelId: dto.parcelId,
        fieldOfficerId: dto.fieldOfficerId ?? user.userId,
        latitude: dto.latitude,
        longitude: dto.longitude,
        evidenceUrl: dto.evidenceUrl,
        remarks: dto.remarks,
        status: PossessionStatus.POSSESSION_RECORDED,
        recordedAt: new Date(),
      },
    });

    await this.audit.log({
      userId: user.userId,
      action: 'POSSESSION_RECORDED',
      entityType: 'PossessionRecord',
      entityId: record.id,
      projectId: dto.projectId,
      parcelId: dto.parcelId,
      possessionId: record.id,
    });

    return record;
  }

  async verify(id: string, user: RequestUser) {
    const existing = await this.findOne(id);

    const updated = await this.prisma.possessionRecord.update({
      where: { id },
      data: { status: PossessionStatus.COMPLETED, verifiedAt: new Date() },
    });

    await this.audit.log({
      userId: user.userId,
      action: 'POSSESSION_VERIFIED',
      entityType: 'PossessionRecord',
      entityId: id,
      projectId: existing.projectId,
      possessionId: id,
    });

    return updated;
  }
}
