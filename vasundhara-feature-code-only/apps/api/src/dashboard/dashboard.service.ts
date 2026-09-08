import { Injectable } from '@nestjs/common';
import { PossessionStatus, RrStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async nationalSummary() {
    const [projects, parcels, families, compensation, possessionsCompleted, rrCasesClosed] =
      await Promise.all([
        this.prisma.project.count(),
        this.prisma.landParcel.count(),
        this.prisma.affectedFamily.count(),
        this.prisma.compensationCase.aggregate({
          _sum: { assessedAmount: true, paidAmount: true },
        }),
        this.prisma.possessionRecord.count({ where: { status: PossessionStatus.COMPLETED } }),
        this.prisma.rrCase.count({ where: { status: RrStatus.CLOSED } }),
      ]);

    return {
      totalProjects: projects,
      totalParcels: parcels,
      totalAffectedFamilies: families,
      compensationAssessed: compensation._sum.assessedAmount ?? 0,
      compensationPaid: compensation._sum.paidAmount ?? 0,
      possessionsCompleted,
      rrCasesClosed,
    };
  }

  async districtSummary(districtId: string) {
    const projects = await this.prisma.project.findMany({
      where: { districtId },
      select: { id: true },
    });
    const projectIds = projects.map((p) => p.id);

    const [parcels, compensation] = await Promise.all([
      this.prisma.landParcel.count({ where: { projectId: { in: projectIds } } }),
      this.prisma.compensationCase.aggregate({
        where: { projectId: { in: projectIds } },
        _sum: { assessedAmount: true, paidAmount: true },
      }),
    ]);

    return {
      totalProjects: projects.length,
      totalParcels: parcels,
      compensationAssessed: compensation._sum.assessedAmount ?? 0,
      compensationPaid: compensation._sum.paidAmount ?? 0,
    };
  }
}
