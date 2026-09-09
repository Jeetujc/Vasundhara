import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  ParcelStatus,
  PossessionStatus,
  Prisma,
} from '../generated/prisma/client.js';
import { AuditService } from '../audit/audit.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePossessionRecordDto } from './dto/create-possession-record.dto.js';
import { UpdatePossessionRecordDto } from './dto/update-possession-record.dto.js';

@Injectable()
export class PossessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  list(projectId?: string, status?: PossessionStatus) {
    return this.prisma.possessionRecord.findMany({
      where: { projectId, status },
      include: {
        project: { select: { id: true, name: true, code: true } },
        parcel: { select: { id: true, parcelNumber: true, village: true, status: true } },
        fieldOfficer: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreatePossessionRecordDto, actorId?: string) {
    const parcel = await this.prisma.landParcel.findUnique({
      where: { id: dto.parcelId },
      select: { id: true, projectId: true, status: true },
    });

    if (!parcel || parcel.projectId !== dto.projectId) {
      throw new BadRequestException('Parcel is not linked to project');
    }

    const hasCompensation = await this.prisma.compensationCase.findFirst({
      where: {
        projectId: dto.projectId,
        parcelId: dto.parcelId,
      },
      select: { id: true },
    });

    if (!hasCompensation) {
      throw new BadRequestException('Compensation case must exist before possession');
    }

    const record = await this.prisma.possessionRecord.create({
      data: {
        projectId: dto.projectId,
        parcelId: dto.parcelId,
        fieldOfficerId: dto.fieldOfficerId,
        remarks: dto.remarks,
        status: PossessionStatus.ELIGIBLE,
      },
    });

    await this.auditService.create({
      action: 'POSSESSION_RECORD_CREATED',
      entityType: 'PossessionRecord',
      entityId: record.id,
      projectId: dto.projectId,
      parcelId: dto.parcelId,
      possessionId: record.id,
      userId: actorId,
      description: dto.remarks ?? 'Possession record created',
    });

    return record;
  }

  async update(id: string, dto: UpdatePossessionRecordDto, actorId?: string) {
    const existing = await this.prisma.possessionRecord.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Possession record not found');
    }

    const status = dto.status ?? existing.status;
    const latitude = dto.latitude ? new Prisma.Decimal(dto.latitude) : existing.latitude;
    const longitude = dto.longitude ? new Prisma.Decimal(dto.longitude) : existing.longitude;

    const updated = await this.prisma.$transaction(async (tx) => {
      const data = await tx.possessionRecord.update({
        where: { id },
        data: {
          status,
          latitude,
          longitude,
          evidenceUrl: dto.evidenceUrl ?? existing.evidenceUrl,
          remarks: dto.remarks ?? existing.remarks,
          recordedAt:
            status === PossessionStatus.POSSESSION_RECORDED ||
            status === PossessionStatus.COMPLETED
              ? new Date()
              : existing.recordedAt,
          verifiedAt:
            status === PossessionStatus.VERIFIED || status === PossessionStatus.COMPLETED
              ? new Date()
              : existing.verifiedAt,
        },
      });

      if (status === PossessionStatus.COMPLETED) {
        await tx.landParcel.update({
          where: { id: data.parcelId },
          data: { status: ParcelStatus.POSSESSION_COMPLETED },
        });
      }

      return data;
    });

    await this.auditService.create({
      action: 'POSSESSION_RECORD_UPDATED',
      entityType: 'PossessionRecord',
      entityId: id,
      projectId: updated.projectId,
      parcelId: updated.parcelId,
      possessionId: id,
      userId: actorId,
      description: dto.remarks ?? 'Possession record updated',
      metadata: {
        status,
        latitude: latitude?.toString() ?? null,
        longitude: longitude?.toString() ?? null,
      },
    });

    return updated;
  }
}
