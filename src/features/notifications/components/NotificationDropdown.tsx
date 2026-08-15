"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Clock, Package, Truck, AlertTriangle, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNotifications } from '../hooks/useNotifications';
import styles from './NotificationDropdown.module.css';
import { NotificationDTO } from '@/types/notification';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const { 
    notifications, 
    unreadCount, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications(1);
    }
  }, [isOpen, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (notification: NotificationDTO) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    setIsOpen(false);

    // Navigate based on entity type
    if (notification.entityType === 'DELIVERY' && notification.entityId) {
      // In a real app we might route to an order detail or timeline
      router.push(`/delivery/orders/${notification.entityId}`);
    } else if (notification.entityType === 'ASSIGNMENT' && notification.entityId) {
      router.push(`/delivery/assignments/${notification.entityId}`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'DELIVERY_ASSIGNED':
      case 'DELIVERY_REASSIGNED':
        return <Truck size={18} color="var(--color-primary)" />;
      case 'DELIVERY_FAILED':
        return <AlertTriangle size={18} color="var(--color-danger)" />;
      case 'DELIVERY_STATUS_UPDATE':
        return <Package size={18} color="var(--color-info)" />;
      default:
        return <Info size={18} color="var(--color-text-secondary)" />;
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button 
        className={styles.iconBtn} 
        title="Notifications"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3 className={styles.title}>Notifications</h3>
            <button 
              className={styles.markAllBtn}
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </button>
          </div>

          <div className={styles.list}>
            {notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <Bell size={32} className={styles.emptyIcon} />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={styles.iconWrapper}>
                    {getIcon(notification.type)}
                  </div>
                  <div className={styles.content}>
                    <div className={styles.itemHeader}>
                      <h4 className={styles.itemTitle}>{notification.title}</h4>
                      {!notification.isRead && <div className={styles.unreadDot} />}
                    </div>
                    <p className={styles.itemMessage}>{notification.message}</p>
                    <div className={styles.itemTime}>
                      <Clock size={12} />
                      <span>{formatTime(notification.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
