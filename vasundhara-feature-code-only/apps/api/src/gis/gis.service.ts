import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

interface ParcelGeoRow {
  id: string;
  parcelNumber: string;
  status: string;
  geojson: string | null;
}

@Injectable()
export class GisService {
  constructor(private readonly prisma: PrismaService) {}

  async getProjectFeatureCollection(projectId: string) {
    const rows = await this.prisma.$queryRaw<ParcelGeoRow[]>`
      SELECT id, "parcelNumber", status, ST_AsGeoJSON(geometry) as geojson
      FROM land_parcels
      WHERE "projectId" = ${projectId}
    `;

    return {
      type: 'FeatureCollection' as const,
      features: rows
        .filter((row) => row.geojson)
        .map((row) => ({
          type: 'Feature' as const,
          geometry: JSON.parse(row.geojson as string),
          properties: { id: row.id, parcelNumber: row.parcelNumber, status: row.status },
        })),
    };
  }
}
