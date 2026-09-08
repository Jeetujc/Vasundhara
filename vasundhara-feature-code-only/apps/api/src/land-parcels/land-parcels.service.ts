import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateParcelDto } from './dto/create-parcel.dto.js';

@Injectable()
export class ParcelsService {
  constructor(private readonly prisma: PrismaService) {}

  findAllForProject(projectId: string) {
    return this.prisma.landParcel.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const parcel = await this.prisma.landParcel.findUnique({ where: { id } });
    if (!parcel) {
      throw new NotFoundException('Land parcel not found');
    }
    return parcel;
  }

  // Inserted via raw SQL because `geometry` is `Unsupported("geometry")` in
  // schema.prisma -- Prisma excludes Unsupported fields from the generated
  // client entirely, so normal `prisma.landParcel.create()` cannot touch it.
  // Every nullable parameter is explicitly cast (::text / ::numeric) because
  // Postgres can't infer a type for a bare NULL parameter.
  async create(dto: CreateParcelDto) {
    const id = randomUUID();
    const geometryJson = dto.geometry ? JSON.stringify(dto.geometry) : null;

    await this.prisma.$executeRaw`
      INSERT INTO land_parcels
        (id, "projectId", "parcelNumber", "surveyNumber", village, tehsil, area, status, geometry, "createdAt", "updatedAt")
      VALUES
        (${id}, ${dto.projectId}, ${dto.parcelNumber},
         ${dto.surveyNumber ?? null}::text,
         ${dto.village ?? null}::text,
         ${dto.tehsil ?? null}::text,
         ${dto.area ?? null}::numeric,
         'PROPOSED',
         CASE WHEN ${geometryJson}::text IS NOT NULL
              THEN ST_SetSRID(ST_GeomFromGeoJSON(${geometryJson}::text), 4326)
              ELSE NULL END,
         now(), now())
    `;

    return this.findOne(id);
  }

  // Returns the parcel's boundary as GeoJSON, e.g. for rendering on the
  // Leaflet map. Not part of findOne() since it's a separate raw query.
  async getGeoJson(id: string) {
    const rows = await this.prisma.$queryRaw<Array<{ geojson: string | null }>>`
      SELECT ST_AsGeoJSON(geometry) as geojson
      FROM land_parcels
      WHERE id = ${id}
    `;

    if (rows.length === 0) {
      throw new NotFoundException('Land parcel not found');
    }

    return rows[0].geojson ? JSON.parse(rows[0].geojson) : null;
  }
}
