import { NotificationDTO } from '@/types/notification';

export interface INotificationRepository {
  getNotifications(page: number, limit: number): Promise<{ data: NotificationDTO[], meta: { total: number, page: number, pageSize: number, totalPages: number } }>;
  getUnreadCount(): Promise<number>;
  markAsRead(id: string): Promise<NotificationDTO>;
  markAllAsRead(): Promise<number>;
}
