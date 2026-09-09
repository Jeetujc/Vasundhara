import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Project } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { ListProjectsQueryDto } from './dto/list-projects-query.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListProjectsQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const where: Prisma.ProjectWhereInput = {
      stateId: query.stateId,
      districtId: query.districtId,
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

  async get(id: string) {
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

    return project;
  }

  async create(dto: CreateProjectDto): Promise<Project> {
    await this.ensureStateAndDistrict(dto.stateId, dto.districtId);

    try {
      return await this.prisma.project.create({
        data: {
          name: dto.name.trim(),
          code: dto.code.trim().toUpperCase(),
          description: dto.description?.trim(),
          stateId: dto.stateId,
          districtId: dto.districtId,
          proposedArea: dto.proposedArea,
        },
      });
    } catch (error) {
      this.handleProjectConflict(error);
      throw error;
    }
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    await this.get(id);

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
