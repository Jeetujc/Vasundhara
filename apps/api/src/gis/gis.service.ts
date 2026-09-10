import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface GeoJsonGeometry {
  type: 'Polygon' | 'Point' | 'LineString' | 'MultiPolygon';
  coordinates: any;
}

export interface GeoJsonFeature {
  type: 'Feature';
  id: string;
  geometry: GeoJsonGeometry;
  properties: Record<string, any>;
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
  metadata?: Record<string, any>;
}

// Fallback high-fidelity coordinates mapping for prototype parcels
const DEFAULT_PARCEL_POLYGONS: Record<string, number[][]> = {
  '452/1': [
    [79.9840, 23.1800],
    [79.9880, 23.1800],
    [79.9885, 23.1840],
    [79.9835, 23.1835],
    [79.9840, 23.1800],
  ],
  '453': [
    [79.9885, 23.1800],
    [79.9920, 23.1800],
    [79.9925, 23.1845],
    [79.9885, 23.1840],
    [79.9885, 23.1800],
  ],
  '108/2': [
    [80.1980, 23.2280],
    [80.2040, 23.2280],
    [80.2035, 23.2330],
    [80.1975, 23.2325],
    [80.1980, 23.2280],
  ],
};

@Injectable()
export class GisService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get spatial summaries for all active projects
   */
  async getProjectsSpatial() {
    const projects = await this.prisma.project.findMany({
      include: {
        state: true,
        district: true,
        _count: {
          select: {
            parcels: true,
            affectedFamilies: true,
            compensationCases: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map((p) => {
      // Synthesize corridor bounds based on district & project code
      const isJbp = p.district.code === 'JBP';
      const center = isJbp ? [79.9864, 23.1815] : [77.4126, 23.2599]; // Jabalpur or Bhopal
      
      const corridorCoordinates = [
        [center[0] - 0.05, center[1] - 0.04],
        [center[0] - 0.02, center[1] - 0.01],
        [center[0] + 0.02, center[1] + 0.02],
        [center[0] + 0.06, center[1] + 0.05],
      ];

      return {
        id: p.id,
        name: p.name,
        code: p.code,
        description: p.description,
        status: p.status,
        stateName: p.state.name,
        districtName: p.district.name,
        proposedAreaHa: p.proposedArea ? Number(p.proposedArea) : 0,
        center: { lng: center[0], lat: center[1] },
        corridorGeometry: {
          type: 'LineString',
          coordinates: corridorCoordinates,
        },
        bufferWidthMeters: 60, // Standard 60m RoW
        parcelsCount: p._count.parcels,
        familiesCount: p._count.affectedFamilies,
        compensationCasesCount: p._count.compensationCases,
      };
    });
  }

  /**
   * Get GeoJSON FeatureCollection of Land Parcels with filtering
   */
  async getParcelsGeoJson(
    projectId?: string,
    village?: string,
    status?: string,
  ): Promise<GeoJsonFeatureCollection> {
    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (village) where.village = { contains: village, mode: 'insensitive' };
    if (status) where.status = status;

    const parcels = await this.prisma.landParcel.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        possessionRecords: {
          take: 1,
          select: {
            id: true,
            status: true,
            latitude: true,
            longitude: true,
            recordedAt: true,
          },
        },
        compensationCases: {
          take: 1,
          select: {
            id: true,
            status: true,
            approvedAmount: true,
            paidAmount: true,
            paymentStatus: true,
          },
        },
        familyParcels: {
          include: {
            family: {
              select: {
                id: true,
                headOfFamily: true,
                contactNumber: true,
                familyReference: true,
              },
            },
          },
        },
      },
      orderBy: { parcelNumber: 'asc' },
    });

    const features: GeoJsonFeature[] = parcels.map((p, idx) => {
      const poss = p.possessionRecords[0];
      const comp = p.compensationCases[0];
      const family = p.familyParcels[0]?.family;

      // Determine polygon coordinates
      let ring = DEFAULT_PARCEL_POLYGONS[p.parcelNumber];
      if (!ring) {
        // Synthesize a localized parcel boundary
        const baseLng = poss?.longitude ? Number(poss.longitude) : 79.9864 + idx * 0.005;
        const baseLat = poss?.latitude ? Number(poss.latitude) : 23.1815 + idx * 0.004;
        const delta = 0.0025;
        ring = [
          [baseLng, baseLat],
          [baseLng + delta, baseLat],
          [baseLng + delta, baseLat + delta],
          [baseLng, baseLat + delta],
          [baseLng, baseLat],
        ];
      }

      // Compute centroid
      const centroidLng = ring.reduce((acc, pt) => acc + pt[0], 0) / ring.length;
      const centroidLat = ring.reduce((acc, pt) => acc + pt[1], 0) / ring.length;

      return {
        type: 'Feature',
        id: p.id,
        geometry: {
          type: 'Polygon',
          coordinates: [ring],
        },
        properties: {
          id: p.id,
          parcelNumber: p.parcelNumber,
          surveyNumber: p.surveyNumber || `SV-${p.parcelNumber}`,
          village: p.village || 'Rau / Panagar',
          tehsil: p.tehsil || 'Panagar',
          areaHa: p.area ? Number(p.area) : 1.0,
          status: p.status,
          projectId: p.projectId,
          projectName: p.project?.name,
          projectCode: p.project?.code,
          centroid: { lng: centroidLng, lat: centroidLat },
          owner: family
            ? {
                name: family.headOfFamily,
                contact: family.contactNumber,
                ref: family.familyReference,
              }
            : null,
          compensation: comp
            ? {
                id: comp.id,
                status: comp.status,
                paymentStatus: comp.paymentStatus,
                approvedAmount: Number(comp.approvedAmount),
                paidAmount: Number(comp.paidAmount),
              }
            : null,
          possession: poss
            ? {
                id: poss.id,
                status: poss.status,
                latitude: poss.latitude ? Number(poss.latitude) : null,
                longitude: poss.longitude ? Number(poss.longitude) : null,
                recordedAt: poss.recordedAt,
              }
            : null,
        },
      };
    });

    return {
      type: 'FeatureCollection',
      features,
      metadata: {
        totalCount: features.length,
        crs: 'EPSG:4326 - WGS 84',
        generatedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Get detailed single parcel spatial data
   */
  async getParcelSpatial(parcelId: string): Promise<GeoJsonFeature> {
    const parcel = await this.prisma.landParcel.findUnique({
      where: { id: parcelId },
      include: {
        project: true,
        possessionRecords: true,
        compensationCases: true,
        familyParcels: {
          include: {
            family: true,
          },
        },
      },
    });

    if (!parcel) {
      throw new NotFoundException(`Parcel ${parcelId} not found`);
    }

    const ring = DEFAULT_PARCEL_POLYGONS[parcel.parcelNumber] || [
      [79.984, 23.18],
      [79.988, 23.18],
      [79.9885, 23.184],
      [79.9835, 23.1835],
      [79.984, 23.18],
    ];

    const poss = parcel.possessionRecords[0];
    const comp = parcel.compensationCases[0];
    const family = parcel.familyParcels[0]?.family;

    return {
      type: 'Feature',
      id: parcel.id,
      geometry: {
        type: 'Polygon',
        coordinates: [ring],
      },
      properties: {
        ...parcel,
        area: parcel.area ? Number(parcel.area) : null,
        owner: family || null,
        compensation: comp || null,
        possession: poss || null,
        cornerPegs: ring.slice(0, ring.length - 1).map((pt, i) => ({
          pegNumber: `P${i + 1}`,
          lng: pt[0],
          lat: pt[1],
        })),
      },
    };
  }

  /**
   * Save or update surveyed boundary coordinates for a parcel
   */
  async saveParcelBoundary(
    parcelId: string,
    dto: {
      coordinates?: number[][];
      latitude?: number;
      longitude?: number;
      remarks?: string;
    },
  ) {
    const parcel = await this.prisma.landParcel.findUnique({
      where: { id: parcelId },
    });

    if (!parcel) {
      throw new NotFoundException(`Parcel ${parcelId} not found`);
    }

    // Update in-memory polygon registry if coordinates provided
    if (dto.coordinates && dto.coordinates.length >= 3) {
      DEFAULT_PARCEL_POLYGONS[parcel.parcelNumber] = dto.coordinates;
    }

    // Update or create possession record with GPS coordinates
    if (dto.latitude !== undefined && dto.longitude !== undefined) {
      const existingPoss = await this.prisma.possessionRecord.findFirst({
        where: { parcelId },
      });

      if (existingPoss) {
        await this.prisma.possessionRecord.update({
          where: { id: existingPoss.id },
          data: {
            latitude: dto.latitude,
            longitude: dto.longitude,
            remarks: dto.remarks || existingPoss.remarks,
            recordedAt: new Date(),
          },
        });
      } else {
        await this.prisma.possessionRecord.create({
          data: {
            projectId: parcel.projectId,
            parcelId: parcel.id,
            latitude: dto.latitude,
            longitude: dto.longitude,
            remarks: dto.remarks || 'GPS Survey boundary walkover completed',
            recordedAt: new Date(),
          },
        });
      }
    }

    return {
      success: true,
      parcelId: parcel.id,
      parcelNumber: parcel.parcelNumber,
      message: 'Spatial boundary coordinates saved successfully.',
    };
  }

  /**
   * Return available GIS map layers
   */
  getLayers() {
    return [
      {
        id: 'osm-standard',
        name: 'OpenStreetMap Carto',
        category: 'Basemap',
        type: 'raster',
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors',
        active: true,
        opacity: 1.0,
      },
      {
        id: 'satellite-hybrid',
        name: 'High-Resolution Satellite Basemap',
        category: 'Basemap',
        type: 'raster',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Esri, Maxar, Earthstar Geographics',
        active: false,
        opacity: 0.85,
      },
      {
        id: 'cadastral-parcels',
        name: 'Cadastral Revenue Parcels (Khasra Boundaries)',
        category: 'Land Records',
        type: 'vector',
        active: true,
        opacity: 0.9,
        legend: {
          PROPOSED: '#94A3B8',
          NOTIFIED: '#3B82F6',
          AWARD_DECLARED: '#F59E0B',
          ACQUIRED: '#10B981',
          OBJECTION: '#EF4444',
        },
      },
      {
        id: 'project-alignment',
        name: 'Project RoW & Buffer Corridor (60m)',
        category: 'Acquisition Corridors',
        type: 'vector',
        active: true,
        opacity: 0.7,
      },
      {
        id: 'village-boundaries',
        name: 'Village Revenue Administrative Boundaries',
        category: 'Boundaries',
        type: 'vector',
        active: true,
        opacity: 0.6,
      },
      {
        id: 'forest-eco-zone',
        name: 'Forest & Eco-Sensitive Areas Buffer',
        category: 'Environmental',
        type: 'vector',
        active: false,
        opacity: 0.5,
      },
    ];
  }

  /**
   * Spatial GIS statistics
   */
  async getGisStats() {
    const [totalParcels, acquiredParcels, possessionRecords, projects] = await Promise.all([
      this.prisma.landParcel.count(),
      this.prisma.landParcel.count({
        where: { status: { in: ['AWARD_DECLARED', 'ACQUIRED', 'COMPENSATION_PAID'] } },
      }),
      this.prisma.possessionRecord.count({
        where: { latitude: { not: null }, longitude: { not: null } },
      }),
      this.prisma.project.count(),
    ]);

    const totalAreaResult = await this.prisma.landParcel.aggregate({
      _sum: { area: true },
    });

    return {
      totalParcels,
      acquiredParcels,
      parcelsWithGps: possessionRecords,
      activeCorridors: projects,
      totalMappedAreaHa: totalAreaResult._sum.area ? Number(totalAreaResult._sum.area) : 7.45,
      gpsWalkoverCompletionRate: totalParcels > 0 ? Math.round((possessionRecords / totalParcels) * 100) : 0,
    };
  }
}
