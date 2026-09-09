import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CompensationStatus,
  PaymentStatus,
  Prisma,
} from '../generated/prisma/client.js';
import { AuditService } from '../audit/audit.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCompensationCaseDto } from './dto/create-compensation-case.dto.js';
import { UpdateCompensationPaymentDto } from './dto/update-compensation-payment.dto.js';

@Injectable()
export class CompensationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  list(projectId?: string, status?: CompensationStatus, paymentStatus?: PaymentStatus) {
    return this.prisma.compensationCase.findMany({
      where: {
        projectId,
        status,
        paymentStatus,
      },
      include: {
        project: { select: { id: true, name: true, code: true } },
        parcel: { select: { id: true, parcelNumber: true, village: true } },
        family: { select: { id: true, familyReference: true, headOfFamily: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateCompensationCaseDto, actorId?: string) {
    await this.ensureReferences(dto.projectId, dto.parcelId, dto.familyId);

    const assessedAmount = new Prisma.Decimal(dto.assessedAmount ?? '0');
    const approvedAmount = new Prisma.Decimal(dto.approvedAmount ?? dto.assessedAmount ?? '0');

    if (approvedAmount.lessThan(0) || assessedAmount.lessThan(0)) {
      throw new BadRequestException('Amounts must be non-negative');
    }

    const pendingAmount = approvedAmount;

    const created = await this.prisma.compensationCase.create({
      data: {
        projectId: dto.projectId,
        parcelId: dto.parcelId,
        familyId: dto.familyId,
        assessedAmount,
        approvedAmount,
        pendingAmount,
        status: CompensationStatus.ASSESSED,
        paymentStatus: PaymentStatus.PENDING,
      },
    });

    await this.auditService.create({
      action: 'COMPENSATION_CASE_CREATED',
      entityType: 'CompensationCase',
      entityId: created.id,
      userId: actorId,
      projectId: dto.projectId,
      compensationId: created.id,
      description: 'Compensation case created',
    });

    return created;
  }

  async updatePayment(id: string, dto: UpdateCompensationPaymentDto, actorId?: string) {
    const existing = await this.prisma.compensationCase.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Compensation case not found');
    }

    const incomingPaidAmount = dto.paidAmount
      ? new Prisma.Decimal(dto.paidAmount)
      : existing.paidAmount;

    if (incomingPaidAmount.lessThan(0)) {
      throw new BadRequestException('Paid amount must be non-negative');
    }

    if (incomingPaidAmount.greaterThan(existing.approvedAmount)) {
      throw new BadRequestException('Paid amount cannot exceed approved amount');
    }

    const pendingAmount = existing.approvedAmount.minus(incomingPaidAmount);
    const paymentStatus =
      dto.paymentStatus ??
      (pendingAmount.equals(0) ? PaymentStatus.DISBURSED : existing.paymentStatus);

    const status = pendingAmount.equals(0)
      ? CompensationStatus.PAID
      : incomingPaidAmount.greaterThan(0)
        ? CompensationStatus.PARTIALLY_PAID
        : existing.status;

    const updated = await this.prisma.compensationCase.update({
      where: { id },
      data: {
        paidAmount: incomingPaidAmount,
        pendingAmount,
        paymentStatus,
        status,
        paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : existing.paymentDate,
        verifiedAt: dto.markVerified ? new Date() : existing.verifiedAt,
      },
    });

    await this.auditService.create({
      action: 'COMPENSATION_PAYMENT_UPDATED',
      entityType: 'CompensationCase',
      entityId: id,
      userId: actorId,
      compensationId: id,
      projectId: updated.projectId,
      description: dto.remarks ?? 'Compensation payment updated',
      metadata: {
        paidAmount: incomingPaidAmount.toString(),
        pendingAmount: pendingAmount.toString(),
        paymentStatus,
      },
    });

    return updated;
  }

  private async ensureReferences(projectId: string, parcelId: string, familyId: string) {
    const [project, parcel, family] = await this.prisma.$transaction([
      this.prisma.project.findUnique({ where: { id: projectId }, select: { id: true } }),
      this.prisma.landParcel.findUnique({ where: { id: parcelId }, select: { id: true, projectId: true } }),
      this.prisma.affectedFamily.findUnique({ where: { id: familyId }, select: { id: true, projectId: true } }),
    ]);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (!parcel || parcel.projectId !== projectId) {
      throw new BadRequestException('Parcel is not linked to project');
    }

    if (!family || family.projectId !== projectId) {
      throw new BadRequestException('Family is not linked to project');
    }
  }
}
