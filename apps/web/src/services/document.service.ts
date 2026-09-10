import { apiClient } from './api-client';

export interface DocumentItem {
  id: string;
  name: string;
  storageKey: string;
  mimeType?: string;
  sizeBytes?: number;
  status: string;
  createdAt: string;
  project?: {
    id: string;
    name: string;
    code: string;
  };
  parcel?: {
    id: string;
    parcelNumber: string;
  };
}

export interface CreateDocumentPayload {
  name: string;
  storageKey: string;
  mimeType?: string;
  sizeBytes?: number;
  projectId?: string;
  parcelId?: string;
  familyId?: string;
  compensationId?: string;
}

export const documentService = {
  getMyDocuments: () => apiClient.get<DocumentItem[]>('/documents/mine'),
  list: (projectId?: string, parcelId?: string) => {
    const params = new URLSearchParams();
    if (projectId) params.set('projectId', projectId);
    if (parcelId) params.set('parcelId', parcelId);
    const suffix = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<DocumentItem[]>(`/documents${suffix}`);
  },
  getById: (id: string) => apiClient.get<DocumentItem>(`/documents/${id}`),
  create: (payload: CreateDocumentPayload) => apiClient.post<DocumentItem>('/documents', payload),
  upload: (payload: CreateDocumentPayload) => apiClient.post<DocumentItem>('/documents', payload),
};
