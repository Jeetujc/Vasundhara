import { apiClient } from './api-client';

export interface Parcel {
  id: string;
  projectId: string;
  parcelNumber: string;
  status: string;
}

export const parcelService = {
  list: async (query?: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).length > 0) {
        params.set(key, String(value));
      }
    });

    const suffix = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<Parcel[]>(`/parcels${suffix}`);
  },
  get: async (id: string) => apiClient.get<Parcel>(`/parcels/${id}`),
  create: async (payload: Record<string, unknown>) =>
    apiClient.post<Parcel>('/parcels', payload),
  update: async (id: string, payload: Record<string, unknown>) =>
    apiClient.patch<Parcel>(`/parcels/${id}`, payload),
};
