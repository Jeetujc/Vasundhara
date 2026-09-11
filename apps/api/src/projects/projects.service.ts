import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Project, Role } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { ListProjectsQueryDto } from './dto/list-projects-query.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

interface UserContext {
  id: string;
  role: Role;
  stateId?: string;
  districtId?: string;
}

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListProjectsQueryDto, user?: UserContext) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;

    let effectiveStateId = query.stateId;
    let effectiveDistrictId = query.districtId;

    if (user?.role === Role.STATE_OFFICER && user.stateId) {
      effectiveStateId = user.stateId;
    } else if (user?.role === Role.DISTRICT_OFFICER && user.districtId) {
      effectiveDistrictId = user.districtId;
    }

    const where: Prisma.ProjectWhereInput = {
      stateId: effectiveStateId,
      districtId: effectiveDistrictId,
      status: query.status,
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { code: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.project.count({ where }),
      this.prisma.project.findMany({
        where,
        include: {
          state: { select: { id: true, name: true, code: true } },
          district: { select: { id: true, name: true, code: true } },
          _count: {
            select: {
              parcels: true,
              workflowInstances: true,
              compensationCases: true,
              possessionRecords: true,
              rrCases: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async get(id: string, user?: UserContext) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        state: true,
        district: true,
        _count: {
          select: {
            parcels: true,
            workflowInstances: true,
            compensationCases: true,
            possessionRecords: true,
            rrCases: true,
            documents: true,
            auditLogs: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (user?.role === Role.STATE_OFFICER && project.stateId !== user.stateId) {
      throw new ForbiddenException('Access denied: Project outside your state');
    }

    if (user?.role === Role.DISTRICT_OFFICER && project.districtId !== user.districtId) {
      throw new ForbiddenException('Access denied: Project outside your district');
    }

    return project;
  }

  async create(dto: CreateProjectDto, user?: UserContext): Promise<Project> {
    if (user?.role === Role.STATE_OFFICER && dto.stateId !== user.stateId) {
      throw new ForbiddenException('Cannot create project outside your assigned state');
    }

    if (user?.role === Role.DISTRICT_OFFICER && user.districtId && dto.districtId !== user.districtId) {
      throw new ForbiddenException('Cannot create project outside your assigned district');
    }

    await this.ensureStateAndDistrict(dto.stateId, dto.districtId);

    const proposedAreaDecimal =
      dto.proposedArea !== undefined && dto.proposedArea !== null && String(dto.proposedArea).trim() !== ''
        ? String(dto.proposedArea)
        : undefined;

    try {
      const project = await this.prisma.project.create({
        data: {
          name: dto.name.trim(),
          code: dto.code.trim().toUpperCase(),
          description: dto.description?.trim(),
          stateId: dto.stateId,
          districtId: dto.districtId,
          proposedArea: proposedAreaDecimal,
        },
      });

      // Automatically initialize the Section 11 workflow instance
      await this.prisma.workflowInstance.create({
        data: {
          projectId: project.id,
          currentStage: 'SECTION_11_NOTIFICATION',
          status: 'IN_PROGRESS',
        },
      }).catch(() => {});

      return project;
    } catch (error) {
      this.handleProjectConflict(error);
      throw error;
    }
  }

  async update(id: string, dto: UpdateProjectDto, user?: UserContext): Promise<Project> {
    await this.get(id, user);

    try {
      return await this.prisma.project.update({
        where: { id },
        data: {
          name: dto.name?.trim(),
          code: dto.code?.trim().toUpperCase(),
          description: dto.description?.trim(),
          status: dto.status,
          proposedArea: dto.proposedArea,
        },
      });
    } catch (error) {
      this.handleProjectConflict(error);
      throw error;
    }
  }

  private async ensureStateAndDistrict(stateId: string, districtId: string) {
    const district = await this.prisma.district.findUnique({
      where: { id: districtId },
      select: { id: true, stateId: true },
    });

    if (!district || district.stateId !== stateId) {
      throw new NotFoundException('District does not belong to selected state');
    }
  }

  private handleProjectConflict(error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Project with this code already exists');
    }
  }
}
