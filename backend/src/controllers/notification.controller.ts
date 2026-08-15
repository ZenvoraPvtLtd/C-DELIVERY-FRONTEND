import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';
import { sendSuccess } from '../utils/response';
import { NotFoundError } from '../utils/errors';

export const getNotifications = async (req: Request, res: Response) => {
  const recipientId = req.user?.userId;
  if (!recipientId) throw new Error('User not authenticated');

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const result = await notificationService.getNotifications(recipientId, page, limit);
  return sendSuccess(res, result);
};

export const getUnreadCount = async (req: Request, res: Response) => {
  const recipientId = req.user?.userId;
  if (!recipientId) throw new Error('User not authenticated');

  const count = await notificationService.getUnreadCount(recipientId);
  return sendSuccess(res, { unreadCount: count });
};

export const markAsRead = async (req: Request, res: Response) => {
  const recipientId = req.user?.userId;
  const { id } = req.params;
  
  if (!recipientId) throw new Error('User not authenticated');

  const notification = await notificationService.markAsRead(id, recipientId);
  if (!notification) {
    throw new NotFoundError('Notification not found or access denied');
  }

  return sendSuccess(res, notification);
};

export const markAllAsRead = async (req: Request, res: Response) => {
  const recipientId = req.user?.userId;
  if (!recipientId) throw new Error('User not authenticated');

  const modifiedCount = await notificationService.markAllAsRead(recipientId);
  return sendSuccess(res, { modifiedCount });
};
