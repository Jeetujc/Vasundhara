import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateFamilyDto } from './dto/create-family.dto.js';

@Injectable()
export class FamiliesService {
  constructor(private readonly prisma: PrismaService) {}

  findAllForProject(projectId: string) {
    return this.prisma.affectedFamily.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const family = await this.prisma.affectedFamily.findUnique({ where: { id } });
    if (!family) {
      throw new NotFoundException('Affected family not found');
    }
    return family;
  }

  create(dto: CreateFamilyDto) {
    return this.prisma.affectedFamily.create({ data: { ...dto } });
  }
}
