import { apiClient } from './api-client';

export interface AdminUserItem {
  id: string;
  name: string;
  aadharId?: string;
  mobileNo: string;
  role: string;
  organizationId?: string;
  stateId?: string;
  districtId?: string;
  tehsilId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateAdminUserPayload {
  name: string;
  aadharId: string;
  mobileNo: string;
  password: string;
  role: string;
  organizationId?: string;
  stateId?: string;
  districtId?: string;
  tehsilId?: string;
}

export const adminService = {
  getUsers: () => apiClient.get<AdminUserItem[]>('/admin/users'),
  createUser: (payload: CreateAdminUserPayload) =>
    apiClient.post<AdminUserItem>('/admin/users', payload),
};
