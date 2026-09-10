import { apiClient } from './api-client';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  status: string;
  readAt?: string;
  sentAt?: string;
  createdAt: string;
}

export const notificationService = {
  getMyNotifications: () => apiClient.get<NotificationItem[]>('/notifications/me'),
  markAsRead: (id: string) => apiClient.patch<NotificationItem>(`/notifications/${id}/read`),
};
