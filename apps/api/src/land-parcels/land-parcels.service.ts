import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ParcelStatus, Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateParcelDto } from './dto/create-parcel.dto.js';
import { ListParcelsQueryDto } from './dto/list-parcels-query.dto.js';
import { UpdateParcelDto } from './dto/update-parcel.dto.js';

@Injectable()
export class ParcelsService {
  constructor(private readonly prisma: PrismaService) {}

  list(query: ListParcelsQueryDto) {
    return this.prisma.landParcel.findMany({
      where: {
        projectId: query.projectId,
        status: query.status,
      },
      include: {
        project: {
          select: { id: true, name: true, code: true, status: true },
        },
        _count: {
          select: {
            familyParcels: true,
            compensationCases: true,
            possessionRecords: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(id: string) {
    const parcel = await this.prisma.landParcel.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true, code: true } },
        familyParcels: {
          include: {
            family: {
              select: {
                id: true,
                familyReference: true,
                headOfFamily: true,
              },
            },
          },
        },
      },
    });

    if (!parcel) {
      throw new NotFoundException('Parcel not found');
    }

    return parcel;
  }

  async create(dto: CreateParcelDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      select: { id: true, status: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const initialStatus =
      project.status === 'PROPOSED' ? ParcelStatus.PROPOSED : ParcelStatus.UNDER_SCRUTINY;

    try {
      return await this.prisma.landParcel.create({
        data: {
          projectId: dto.projectId,
          parcelNumber: dto.parcelNumber.trim(),
          surveyNumber: dto.surveyNumber?.trim(),
          village: dto.village?.trim(),
          tehsil: dto.tehsil?.trim(),
          area: dto.area,
          status: initialStatus,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Parcel number already exists in this project');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateParcelDto) {
    await this.get(id);

    return this.prisma.landParcel.update({
      where: { id },
      data: {
        parcelNumber: dto.parcelNumber?.trim(),
        surveyNumber: dto.surveyNumber?.trim(),
        village: dto.village?.trim(),
        tehsil: dto.tehsil?.trim(),
        area: dto.area,
        status: dto.status,
      },
    });
  }
}
