export type NotificationType = 
  | 'DELIVERY_ASSIGNED'
  | 'DELIVERY_REASSIGNED'
  | 'DELIVERY_STATUS_UPDATE'
  | 'DELIVERY_FAILED'
  | 'PARTNER_STATUS_CHANGED'
  | 'SYSTEM_ALERT';

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
export type NotificationEntityType = 'DELIVERY' | 'ORDER' | 'ASSIGNMENT' | 'PARTNER';

export interface NotificationDTO {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: NotificationEntityType;
  entityId?: string;
  priority: NotificationPriority;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  metadata?: any;
}
