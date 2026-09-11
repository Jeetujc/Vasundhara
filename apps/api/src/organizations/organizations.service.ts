import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/create-organization.dto.js';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const orgs = await this.prisma.organization.findMany({
      include: {
        states: {
          select: {
            id: true,
            name: true,
            code: true,
            _count: {
              select: {
                projects: true,
                districts: true,
              },
            },
          },
        },
        _count: {
          select: {
            users: true,
            states: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Also enrich with total projects count for each organization
    const enriched = await Promise.all(
      orgs.map(async (org) => {
        const stateIds = org.states.map((s) => s.id);
        const projectsCount = await this.prisma.project.count({
          where: { stateId: { in: stateIds } },
        });

        const activeAreaSum = await this.prisma.project.aggregate({
          where: { stateId: { in: stateIds } },
          _sum: { proposedArea: true },
        });

        return {
          id: org.id,
          name: org.name,
          code: org.code,
          createdAt: org.createdAt,
          updatedAt: org.updatedAt,
          statesCount: org._count.states,
          usersCount: org._count.users,
          projectsCount,
          totalAcquisitionAreaHa: activeAreaSum._sum.proposedArea
            ? Number(activeAreaSum._sum.proposedArea)
            : 0,
          states: org.states,
        };
      }),
    );

    return enriched;
  }

  async getById(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        states: {
          include: {
            projects: {
              select: {
                id: true,
                name: true,
                code: true,
                status: true,
                proposedArea: true,
              },
            },
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            role: true,
            mobileNo: true,
          },
        },
      },
    });

    if (!org) {
      throw new NotFoundException(`Organization with ID "${id}" not found`);
    }

    return org;
  }

  async create(dto: CreateOrganizationDto) {
    const code = dto.code ? dto.code.trim().toUpperCase() : dto.name.replace(/[^a-zA-Z0-9]/g, '-').toUpperCase();

    const existing = await this.prisma.organization.findFirst({
      where: {
        OR: [{ name: dto.name.trim() }, ...(code ? [{ code }] : [])],
      },
    });

    if (existing) {
      throw new ConflictException('An organization with this name or code already exists');
    }

    return this.prisma.organization.create({
      data: {
        name: dto.name.trim(),
        code,
      },
    });
  }

  async update(id: string, dto: UpdateOrganizationDto) {
    const org = await this.prisma.organization.findUnique({ where: { id } });
    if (!org) {
      throw new NotFoundException(`Organization with ID "${id}" not found`);
    }

    return this.prisma.organization.update({
      where: { id },
      data: {
        name: dto.name ? dto.name.trim() : undefined,
        code: dto.code ? dto.code.trim().toUpperCase() : undefined,
      },
    });
  }
}
