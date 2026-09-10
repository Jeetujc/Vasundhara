import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGrievanceDto } from './dto/create-grievance.dto.js';
import { UpdateGrievanceDto } from './dto/update-grievance.dto.js';
import { GrievanceStatus, Role } from '../generated/prisma/client.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { AuditService } from '../audit/audit.service.js';

interface UserContext {
  id: string;
  role: Role;
  stateId?: string;
  districtId?: string;
}

@Injectable()
export class GrievancesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateGrievanceDto, userId: string) {
    const count = await this.prisma.grievance.count();
    const ticketNo = `G-${10500 + count}`;

    const grievance = await this.prisma.grievance.create({
      data: {
        ticketNo,
        userId,
        projectId: dto.projectId,
        category: dto.category,
        description: dto.description,
        khasraNo: dto.khasraNo,
        evidenceUrl: dto.evidenceUrl,
        status: GrievanceStatus.SUBMITTED,
      },
      include: {
        project: { select: { id: true, name: true, code: true } },
      },
    });

    await this.auditService.create({
      action: 'GRIEVANCE_SUBMITTED',
      entityType: 'Grievance',
      entityId: grievance.id,
      userId,
      projectId: dto.projectId,
      description: `Grievance submitted under ticket ${ticketNo}`,
      metadata: { category: dto.category, ticketNo },
    });

    await this.notificationsService.create(
      userId,
      'Grievance Acknowledged',
      `Your grievance has been registered with ticket number ${ticketNo}. The Competent Authority will review your submission.`,
    );

    return grievance;
  }

  async listMine(userId: string) {
    return this.prisma.grievance.findMany({
      where: { userId },
      include: {
        project: { select: { id: true, name: true, code: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async list(user: UserContext, projectId?: string, status?: GrievanceStatus) {
    const where: any = {
      ...(projectId ? { projectId } : {}),
      ...(status ? { status } : {}),
    };

    if (user.role === Role.PUBLIC_USER) {
      where.userId = user.id;
    } else if (user.role === Role.STATE_OFFICER) {
      where.project = { stateId: user.stateId };
    } else if (user.role === Role.DISTRICT_OFFICER) {
      where.project = { districtId: user.districtId };
    }

    return this.prisma.grievance.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, mobileNo: true, aadharId: true } },
        project: { select: { id: true, name: true, code: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string, user: UserContext) {
    const grievance = await this.prisma.grievance.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, mobileNo: true, aadharId: true } },
        project: { select: { id: true, name: true, code: true, stateId: true, districtId: true } },
      },
    });

    if (!grievance) {
      throw new NotFoundException('Grievance not found');
    }

    if (user.role === Role.PUBLIC_USER && grievance.userId !== user.id) {
      throw new ForbiddenException('Access denied to this grievance');
    }

    if (user.role === Role.STATE_OFFICER && grievance.project?.stateId !== user.stateId) {
      throw new ForbiddenException('Grievance outside state jurisdiction');
    }

    if (user.role === Role.DISTRICT_OFFICER && grievance.project?.districtId !== user.districtId) {
      throw new ForbiddenException('Grievance outside district jurisdiction');
    }

    return grievance;
  }

  async updateStatus(id: string, dto: UpdateGrievanceDto, actorId: string) {
    const grievance = await this.prisma.grievance.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!grievance) {
      throw new NotFoundException('Grievance not found');
    }

    const updated = await this.prisma.grievance.update({
      where: { id },
      data: {
        status: dto.status,
        resolution: dto.resolution,
        resolvedAt: dto.status === GrievanceStatus.RESOLVED ? new Date() : null,
      },
    });

    await this.auditService.create({
      action: 'GRIEVANCE_STATUS_UPDATED',
      entityType: 'Grievance',
      entityId: id,
      userId: actorId,
      projectId: grievance.projectId ?? undefined,
      description: `Grievance ${grievance.ticketNo} status changed to ${dto.status}`,
      metadata: { status: dto.status, resolution: dto.resolution },
    });

    await this.notificationsService.create(
      grievance.userId,
      `Grievance Update: ${grievance.ticketNo}`,
      `Your grievance ${grievance.ticketNo} is now ${dto.status}.${dto.resolution ? ' Resolution: ' + dto.resolution : ''}`,
    );

    return updated;
  }
}
