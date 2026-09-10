import { apiClient } from './api-client';

export interface GisProjectItem {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: string;
  stateName: string;
  districtName: string;
  proposedAreaHa: number;
  center: { lng: number; lat: number };
  corridorGeometry: {
    type: 'LineString';
    coordinates: number[][];
  };
  bufferWidthMeters: number;
  parcelsCount: number;
  familiesCount: number;
  compensationCasesCount: number;
}

export interface GisParcelFeature {
  type: 'Feature';
  id: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  properties: {
    id: string;
    parcelNumber: string;
    surveyNumber: string;
    village: string;
    tehsil: string;
    areaHa: number;
    status: string;
    projectId: string;
    projectName: string;
    projectCode: string;
    centroid: { lng: number; lat: number };
    owner?: {
      name: string;
      contact: string;
      ref: string;
    } | null;
    compensation?: {
      id: string;
      status: string;
      paymentStatus: string;
      approvedAmount: number;
      paidAmount: number;
    } | null;
    possession?: {
      id: string;
      status: string;
      latitude: number | null;
      longitude: number | null;
      recordedAt: string | null;
    } | null;
    cornerPegs?: { pegNumber: string; lng: number; lat: number }[];
  };
}

export interface GisFeatureCollection {
  type: 'FeatureCollection';
  features: GisParcelFeature[];
  metadata?: {
    totalCount: number;
    crs: string;
    generatedAt: string;
  };
}

export interface GisLayerItem {
  id: string;
  name: string;
  category: string;
  type: 'raster' | 'vector';
  url?: string;
  attribution?: string;
  active: boolean;
  opacity: number;
  legend?: Record<string, string>;
}

export interface GisStatsData {
  totalParcels: number;
  acquiredParcels: number;
  parcelsWithGps: number;
  activeCorridors: number;
  totalMappedAreaHa: number;
  gpsWalkoverCompletionRate: number;
}

export const gisService = {
  getProjects: async (): Promise<GisProjectItem[]> =>
    apiClient.get('/gis/projects'),

  getParcels: async (params?: {
    projectId?: string;
    village?: string;
    status?: string;
  }): Promise<GisFeatureCollection> => {
    const query = new URLSearchParams();
    if (params?.projectId) query.append('projectId', params.projectId);
    if (params?.village) query.append('village', params.village);
    if (params?.status) query.append('status', params.status);
    const qs = query.toString();
    return apiClient.get(`/gis/parcels${qs ? `?${qs}` : ''}`);
  },

  getParcel: async (parcelId: string): Promise<GisParcelFeature> =>
    apiClient.get(`/gis/parcels/${encodeURIComponent(parcelId)}`),

  saveParcelBoundary: async (
    parcelId: string,
    data: {
      coordinates?: number[][];
      latitude?: number;
      longitude?: number;
      remarks?: string;
    },
  ) =>
    apiClient.post(
      `/gis/parcels/${encodeURIComponent(parcelId)}/boundary`,
      data,
    ),

  getLayers: async (): Promise<GisLayerItem[]> => apiClient.get('/gis/layers'),

  getStats: async (): Promise<GisStatsData> => apiClient.get('/gis/stats'),

  listProjectParcelsGeo: async (projectId: string) =>
    apiClient.get(`/gis/parcels?projectId=${encodeURIComponent(projectId)}`),
};
