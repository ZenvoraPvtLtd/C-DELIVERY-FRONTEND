import Notification, { INotification } from '../models/Notification.model';

export class NotificationRepository {
  async create(data: Partial<INotification>): Promise<INotification> {
    const notification = new Notification(data);
    return notification.save();
  }

  async findForUser(recipientId: string, page: number = 1, limit: number = 20): Promise<{ data: INotification[], total: number }> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      Notification.find({ recipientId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Notification.countDocuments({ recipientId })
    ]);

    return { data, total };
  }

  async countUnread(recipientId: string): Promise<number> {
    return Notification.countDocuments({ recipientId, isRead: false });
  }

  async markAsRead(id: string, recipientId: string): Promise<INotification | null> {
    return Notification.findOneAndUpdate(
      { _id: id, recipientId },
      { $set: { isRead: true, readAt: new Date() } },
      { new: true }
    );
  }

  async markAllAsRead(recipientId: string): Promise<number> {
    const result = await Notification.updateMany(
      { recipientId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );
    return result.modifiedCount;
  }
}

export const notificationRepository = new NotificationRepository();
