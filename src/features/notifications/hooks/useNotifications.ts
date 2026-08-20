import { useState, useCallback, useEffect } from 'react';
import { notificationService } from '@/services/notifications/notificationService';
import { NotificationDTO } from '@/types/notification';
import { useAuth } from '@/features/auth/AuthContext';

let lastUnreadFetchTime = 0;
let cachedUnreadCount = 0;
const UNREAD_CACHE_TTL_MS = 15000;

export function useNotifications() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(cachedUnreadCount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (page = 1) => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await notificationService.getNotifications(page, 20);
      setNotifications(res.data);
      const count = await notificationService.getUnreadCount();
      cachedUnreadCount = count;
      lastUnreadFetchTime = Date.now();
      setUnreadCount(count);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = useCallback(async (force = false) => {
    if (!isAuthenticated) return;
    const now = Date.now();
    if (!force && now - lastUnreadFetchTime < UNREAD_CACHE_TTL_MS) {
      setUnreadCount(cachedUnreadCount);
      return;
    }
    try {
      const count = await notificationService.getUnreadCount();
      cachedUnreadCount = count;
      lastUnreadFetchTime = now;
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to fetch unread count', err);
    }
  }, [isAuthenticated]);

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      cachedUnreadCount = Math.max(0, cachedUnreadCount - 1);
      setUnreadCount(cachedUnreadCount);
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      cachedUnreadCount = 0;
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    }
  }, [isAuthenticated, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead
  };
}
