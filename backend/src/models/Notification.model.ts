import mongoose, { Schema, Document } from 'mongoose';

export type NotificationType = 
  | 'DELIVERY_ASSIGNED'
  | 'DELIVERY_REASSIGNED'
  | 'DELIVERY_STATUS_UPDATE'
  | 'DELIVERY_FAILED'
  | 'PARTNER_STATUS_CHANGED'
  | 'SYSTEM_ALERT';

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
export type NotificationEntityType = 'DELIVERY' | 'ORDER' | 'ASSIGNMENT' | 'PARTNER';

export interface INotification extends Document {
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: NotificationEntityType;
  entityId?: string;
  priority: NotificationPriority;
  isRead: boolean;
  readAt?: Date;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema({
  recipientId: { type: String, required: true, index: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  entityType: { type: String },
  entityId: { type: String },
  priority: { type: String, enum: ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'], default: 'NORMAL' },
  isRead: { type: Boolean, default: false, index: true },
  readAt: { type: Date },
  metadata: { type: Schema.Types.Mixed }
}, {
  timestamps: true
});

// Indexes for common queries
NotificationSchema.index({ recipientId: 1, createdAt: -1 });
NotificationSchema.index({ recipientId: 1, isRead: 1 });

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
