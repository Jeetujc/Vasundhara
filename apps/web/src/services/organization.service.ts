import { apiClient } from './api-client';

export interface OrganizationItem {
  id: string;
  name: string;
  code?: string;
  createdAt: string;
  updatedAt: string;
  statesCount: number;
  usersCount: number;
  projectsCount: number;
  totalAcquisitionAreaHa: number;
  states?: {
    id: string;
    name: string;
    code: string;
    _count?: {
      projects: number;
      districts: number;
    };
  }[];
}

export interface CreateOrganizationPayload {
  name: string;
  code?: string;
}

export const organizationService = {
  list: () => apiClient.get<OrganizationItem[]>('/organizations'),
  getById: (id: string) => apiClient.get<OrganizationItem>(`/organizations/${id}`),
  create: (payload: CreateOrganizationPayload) => apiClient.post<OrganizationItem>('/organizations', payload),
  update: (id: string, payload: Partial<CreateOrganizationPayload>) =>
    apiClient.patch<OrganizationItem>(`/organizations/${id}`, payload),
};
