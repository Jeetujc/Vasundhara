import { apiClient } from './api-client';

export const compensationService = {
  list: async (query?: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    const suffix = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get(`/compensation${suffix}`);
  },
  create: async (payload: Record<string, unknown>) =>
    apiClient.post('/compensation', payload),
  updatePayment: async (id: string, payload: Record<string, unknown>) =>
    apiClient.patch(`/compensation/${id}/payment`, payload),
};
