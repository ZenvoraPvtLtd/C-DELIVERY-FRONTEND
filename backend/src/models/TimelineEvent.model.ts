import mongoose, { Schema, Document } from 'mongoose';
import { DeliveryStatus } from '../constants/deliveryStatus';

export interface ITimelineEvent extends Document {
  deliveryId: mongoose.Types.ObjectId;
  orderId: string;
  status: DeliveryStatus;
  previousStatus?: DeliveryStatus;
  eventType: string; // e.g. STATUS_CHANGE, NOTE_ADDED
  actorId?: string;
  actorRole?: string;
  notes?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TimelineEventSchema: Schema = new Schema({
  deliveryId: { type: Schema.Types.ObjectId, ref: 'Delivery', required: true, index: true },
  orderId: { type: String, required: true, index: true },
  status: { type: String, required: true },
  previousStatus: { type: String },
  eventType: { type: String, required: true, default: 'STATUS_CHANGE' },
  actorId: { type: String },
  actorRole: { type: String },
  notes: { type: String },
  metadata: { type: Schema.Types.Mixed },
  timestamp: { type: Date, required: true, default: Date.now, index: true }
}, { 
  timestamps: true 
});

// Setup compound indexes for fetching timeline by delivery ordered by time
TimelineEventSchema.index({ deliveryId: 1, timestamp: -1 });

export default mongoose.model<ITimelineEvent>('TimelineEvent', TimelineEventSchema);
