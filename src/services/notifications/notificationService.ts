import { repositoryFactory } from '@/repositories';

const notificationRepo = repositoryFactory.getNotificationRepository();

export const notificationService = {
  getNotifications: async (page = 1, limit = 20) => {
    return notificationRepo.getNotifications(page, limit);
  },

  getUnreadCount: async () => {
    return notificationRepo.getUnreadCount();
  },

  markAsRead: async (id: string) => {
    return notificationRepo.markAsRead(id);
  },

  markAllAsRead: async () => {
    return notificationRepo.markAllAsRead();
  }
};
