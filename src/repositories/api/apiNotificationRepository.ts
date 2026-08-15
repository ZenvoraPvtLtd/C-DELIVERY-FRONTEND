import { INotificationRepository } from '../interfaces/INotificationRepository';
import { NotificationDTO } from '@/types/notification';
import { apiClient } from '@/lib/api/apiClient';

export const apiNotificationRepository: INotificationRepository = {
  async getNotifications(page = 1, limit = 20) {
    const response = await apiClient.get<any>(`/notifications?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getUnreadCount() {
    const response = await apiClient.get<any>('/notifications/unread-count');
    return response.data.unreadCount;
  },

  async markAsRead(id: string) {
    const response = await apiClient.patch<any>(`/notifications/${id}/read`, {});
    return response.data;
  },

  async markAllAsRead() {
    const response = await apiClient.patch<any>('/notifications/read-all', {});
    return response.data.modifiedCount;
  }
};
