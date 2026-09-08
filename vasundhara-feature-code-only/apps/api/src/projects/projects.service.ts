import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { RequestUser } from '../auth/interfaces/request-user.interface.js';
import type { CreateProjectDto } from './dto/create-project.dto.js';
import type { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  // ADMIN/CENTRAL_OFFICER see everything. STATE_OFFICER is scoped to their
  // state. DISTRICT_OFFICER/FIELD_OFFICER are scoped to their district.
  private jurisdictionWhere(user: RequestUser) {
    if (user.role === Role.ADMIN || user.role === Role.CENTRAL_OFFICER) {
      return {};
    }
    if (user.role === Role.STATE_OFFICER) {
      return { stateId: user.stateId ?? '__no_state_assigned__' };
    }
    return { districtId: user.districtId ?? '__no_district_assigned__' };
  }

  private assertVisible(project: { stateId: string; districtId: string }, user: RequestUser) {
    if (user.role === Role.ADMIN || user.role === Role.CENTRAL_OFFICER) return;
    if (user.role === Role.STATE_OFFICER && project.stateId === user.stateId) return;
    if (
      (user.role === Role.DISTRICT_OFFICER || user.role === Role.FIELD_OFFICER) &&
      project.districtId === user.districtId
    ) {
      return;
    }
    throw new ForbiddenException('You do not have access to this project');
  }

  findAll(user: RequestUser) {
    return this.prisma.project.findMany({
      where: this.jurisdictionWhere(user),
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, user: RequestUser) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    this.assertVisible(project, user);
    return project;
  }

  create(dto: CreateProjectDto, user: RequestUser) {
    if (user.role === Role.STATE_OFFICER && user.stateId !== dto.stateId) {
      throw new ForbiddenException('Cannot create a project outside your assigned state');
    }
    if (user.role === Role.DISTRICT_OFFICER && user.districtId !== dto.districtId) {
      throw new ForbiddenException('Cannot create a project outside your assigned district');
    }

    return this.prisma.project.create({
      data: {
        name: dto.name,
        code: dto.code,
        description: dto.description,
        stateId: dto.stateId,
        districtId: dto.districtId,
        proposedArea: dto.proposedArea,
        proposalDate: dto.proposalDate ? new Date(dto.proposalDate) : undefined,
      },
    });
  }

  async update(id: string, dto: UpdateProjectDto, user: RequestUser) {
    const project = await this.findOne(id, user);

    return this.prisma.project.update({
      where: { id: project.id },
      data: {
        name: dto.name,
        description: dto.description,
        status: dto.status,
        proposedArea: dto.proposedArea,
        approvalDate: dto.approvalDate ? new Date(dto.approvalDate) : undefined,
        closureDate: dto.closureDate ? new Date(dto.closureDate) : undefined,
      },
    });
  }
}
