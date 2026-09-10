import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  getStates() {
    return this.prisma.state.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });
  }

  getDistricts(stateId: string) {
    return this.prisma.district.findMany({
      where: {
        stateId,
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });
  }

  getTehsils(districtId: string) {
    return this.prisma.tehsil.findMany({
      where: {
        districtId,
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });
  }
}