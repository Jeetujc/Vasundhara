import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuditService } from '../audit/audit.service.js';
import type { RequestUser } from '../auth/interfaces/request-user.interface.js';
import type { CreateCompensationDto } from './dto/create-compensation.dto.js';
import type { UpdateCompensationDto } from './dto/update-compensation.dto.js';

@Injectable()
export class CompensationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  findAllForProject(projectId: string) {
    return this.prisma.compensationCase.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.compensationCase.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('Compensation case not found');
    }
    return item;
  }

  async create(dto: CreateCompensationDto, user: RequestUser) {
    const compensation = await this.prisma.compensationCase.create({
      data: {
        projectId: dto.projectId,
        parcelId: dto.parcelId,
        familyId: dto.familyId,
        assessedAmount: dto.assessedAmount,
        pendingAmount: dto.assessedAmount,
      },
    });

    await this.audit.log({
      userId: user.userId,
      action: 'COMPENSATION_ASSESSED',
      entityType: 'CompensationCase',
      entityId: compensation.id,
      projectId: dto.projectId,
      compensationId: compensation.id,
    });

    return compensation;
  }

  // NOTE: this does not recompute pendingAmount from assessed/paid figures --
  // that needs decimal-safe arithmetic (a JS float subtraction on Decimal
  // strings risks rounding errors on real money). Track that as a follow-up
  // once a decimal library (e.g. decimal.js) is added.
  async pay(id: string, dto: UpdateCompensationDto, user: RequestUser) {
    const existing = await this.findOne(id);

    const updated = await this.prisma.compensationCase.update({
      where: { id },
      data: {
        status: dto.status ?? undefined,
        paymentStatus: dto.paymentStatus ?? undefined,
        approvedAmount: dto.approvedAmount ?? undefined,
        paidAmount: dto.paidAmount ?? undefined,
        paymentDate: dto.paymentStatus === PaymentStatus.DISBURSED ? new Date() : undefined,
      },
    });

    await this.audit.log({
      userId: user.userId,
      action: 'COMPENSATION_UPDATED',
      entityType: 'CompensationCase',
      entityId: id,
      projectId: existing.projectId,
      compensationId: id,
      description: `Status: ${dto.status ?? existing.status}, Payment: ${dto.paymentStatus ?? existing.paymentStatus}`,
    });

    return updated;
  }
}
