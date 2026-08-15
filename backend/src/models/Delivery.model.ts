import mongoose, { Schema, Document } from 'mongoose';
import { DeliveryStatus, DeliveryPriority, FailureStatus } from '../constants/deliveryStatus';

export interface IDelivery extends Document {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderAmount: number;
  orderDate: Date;
  priority: DeliveryPriority;
  status: DeliveryStatus;
  partnerId?: mongoose.Types.ObjectId;
  assignedAt?: Date;
  pickupAt?: Date;
  outForDeliveryAt?: Date;
  deliveredAt?: Date;
  failureReason?: string;
  failureNotes?: string;
  failedAt?: Date;
  failureStatus?: FailureStatus;
  failureDescription?: string;
  attemptCount: number;
  lastAttemptAt?: Date;
  resolution?: string;
  resolvedAt?: Date;
  internalNotes?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DeliverySchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  customerName: { type: String, required: true, trim: true },
  customerPhone: { type: String, required: true, trim: true },
  deliveryAddress: { type: String, required: true },
  orderAmount: { type: Number, required: true, min: 0 },
  orderDate: { type: Date, required: true, index: true },
  priority: { type: String, required: true, index: true },
  status: { type: String, required: true, default: 'WAITING_FOR_ASSIGNMENT', index: true },
  partnerId: { type: Schema.Types.ObjectId, ref: 'DeliveryPartner', index: true },
  assignedAt: { type: Date },
  pickupAt: { type: Date },
  outForDeliveryAt: { type: Date },
  deliveredAt: { type: Date },
  failureReason: { type: String },
  failureNotes: { type: String },
  failedAt: { type: Date, index: true },
  failureStatus: { type: String },
  failureDescription: { type: String },
  attemptCount: { type: Number, default: 0 },
  lastAttemptAt: { type: Date },
  resolution: { type: String },
  resolvedAt: { type: Date },
  internalNotes: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date }
}, { 
  timestamps: true 
});

// Setup compound indexes for common queries
DeliverySchema.index({ status: 1, priority: 1 });
DeliverySchema.index({ partnerId: 1, status: 1 });

export default mongoose.model<IDelivery>('Delivery', DeliverySchema);
