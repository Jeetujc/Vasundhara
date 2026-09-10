import { apiClient } from './api-client';

export interface GrievanceItem {
  id: string;
  ticketNo: string;
  category: string;
  description: string;
  khasraNo?: string;
  evidenceUrl?: string;
  status: string;
  resolution?: string;
  resolvedAt?: string;
  createdAt: string;
  project?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface CreateGrievancePayload {
  category: string;
  description: string;
  projectId?: string;
  khasraNo?: string;
  evidenceUrl?: string;
}

export const grievanceService = {
  create: (payload: CreateGrievancePayload) =>
    apiClient.post<GrievanceItem>('/grievances', payload),
  getMyGrievances: () => apiClient.get<GrievanceItem[]>('/grievances/mine'),
  list: (projectId?: string, status?: string) => {
    const params = new URLSearchParams();
    if (projectId) params.set('projectId', projectId);
    if (status) params.set('status', status);
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<GrievanceItem[]>(`/grievances${suffix}`);
  },
  getById: (id: string) => apiClient.get<GrievanceItem>(`/grievances/${id}`),
};
