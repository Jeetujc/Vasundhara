import { apiClient } from './api-client';

export const possessionService = {
  list: async (query?: { projectId?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (query?.projectId) params.append('projectId', query.projectId);
    if (query?.status) params.append('status', query.status);
    const qs = params.toString();
    return apiClient.get(`/possession${qs ? `?${qs}` : ''}`);
  },
  create: async (payload: Record<string, unknown>) =>
    apiClient.post('/possession', payload),
  update: async (id: string, payload: Record<string, unknown>) =>
    apiClient.patch(`/possession/${encodeURIComponent(id)}`, payload),
};
