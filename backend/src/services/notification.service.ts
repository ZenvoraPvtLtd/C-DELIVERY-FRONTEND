import { notificationRepository } from '../repositories/notification.repository';
import { INotification, NotificationType, NotificationPriority, NotificationEntityType } from '../models/Notification.model';

export class NotificationService {
  async createNotification(params: {
    recipientId: string;
    type: NotificationType;
    title: string;
    message: string;
    entityType?: NotificationEntityType;
    entityId?: string;
    priority?: NotificationPriority;
    metadata?: any;
  }): Promise<INotification> {
    return notificationRepository.create({
      ...params,
      priority: params.priority || 'NORMAL'
    });
  }

  async getNotifications(recipientId: string, page: number = 1, limit: number = 20) {
    const { data, total } = await notificationRepository.findForUser(recipientId, page, limit);
    return {
      data,
      meta: {
        total,
        page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    return notificationRepository.countUnread(recipientId);
  }

  async markAsRead(id: string, recipientId: string): Promise<INotification | null> {
    return notificationRepository.markAsRead(id, recipientId);
  }

  async markAllAsRead(recipientId: string): Promise<number> {
    return notificationRepository.markAllAsRead(recipientId);
  }

  async notifyRoles(roles: string[], params: {
    type: NotificationType;
    title: string;
    message: string;
    entityType?: NotificationEntityType;
    entityId?: string;
    priority?: NotificationPriority;
    metadata?: any;
  }): Promise<void> {
    // dynamically import User to avoid circular dependencies if any
    const User = (await import('../models/User.model')).default;
    const users = await User.find({ role: { $in: roles }, isActive: true, isDeleted: false });
    
    if (users.length > 0) {
      const notifications = users.map(user => ({
        recipientId: user._id?.toString(),
        ...params,
        priority: params.priority || 'NORMAL'
      }));
      // Assuming we can just create them sequentially or use insertMany. Let's use Promise.all.
      await Promise.all(notifications.map(n => notificationRepository.create(n as any)));
    }
  }
}

export const notificationService = new NotificationService();
