import { INotificationRepository } from '../interfaces/INotificationRepository';
import { NotificationDTO } from '@/types/notification';

export const mockNotificationRepository: INotificationRepository = {
  async getNotifications(page = 1, limit = 20) {
    return { data: [], meta: { total: 0, page, pageSize: limit, totalPages: 0 } };
  },

  async getUnreadCount() {
    return 0;
  },

  async markAsRead(id: string) {
    return {} as NotificationDTO;
  },

  async markAllAsRead() {
    return 0;
  }
};
