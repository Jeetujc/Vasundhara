import { apiClient } from './api-client';

export interface WorkflowTask {
  id: string;
  workflowId: string;
  stage: string;
  status: string;
}

export const workflowService = {
  list: async (projectId?: string) => {
    const suffix = projectId ? `?projectId=${encodeURIComponent(projectId)}` : '';
    return apiClient.get(`/workflow${suffix}`);
  },
  get: async (id: string) => apiClient.get(`/workflow/${id}`),
  start: async (payload: Record<string, unknown>) => apiClient.post('/workflow/start', payload),
  listTasks: async (query?: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    const suffix = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<WorkflowTask[]>(`/workflow/tasks${suffix}`);
  },
  completeTask: async (taskId: string, payload: Record<string, unknown>) =>
    apiClient.patch(`/workflow/tasks/${taskId}/complete`, payload),
};
