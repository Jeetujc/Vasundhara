import { apiClient } from './api-client';

export const gisService = {
  listProjectParcelsGeo: async (projectId: string) =>
    apiClient.get(`/parcels?projectId=${encodeURIComponent(projectId)}`),
};
