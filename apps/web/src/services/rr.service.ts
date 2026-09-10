import { apiClient } from './api-client';

export const rrService = {
  list: async (query?: { projectId?: string; familyId?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (query?.projectId) params.append('projectId', query.projectId);
    if (query?.familyId) params.append('familyId', query.familyId);
    if (query?.status) params.append('status', query.status);
    const qs = params.toString();
    return apiClient.get(`/r-and-r${qs ? `?${qs}` : ''}`);
  },
  create: async (payload: Record<string, unknown>) =>
    apiClient.post('/r-and-r', payload),
  update: async (id: string, payload: Record<string, unknown>) =>
    apiClient.patch(`/r-and-r/${encodeURIComponent(id)}`, payload),
};
