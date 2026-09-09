import { apiClient } from './api-client';

export interface Project {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: string;
}

export const projectService = {
  list: async (query?: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();

    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).length > 0) {
        params.set(key, String(value));
      }
    });

    const suffix = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<{ data: Project[]; total: number }>(`/projects${suffix}`);
  },
  get: async (id: string) => apiClient.get<Project>(`/projects/${id}`),
  create: async (payload: Record<string, unknown>) =>
    apiClient.post<Project>('/projects', payload),
  update: async (id: string, payload: Record<string, unknown>) =>
    apiClient.patch<Project>(`/projects/${id}`, payload),
};
