import mongoose, { Schema, Document } from 'mongoose';
import { AssignmentStatus } from '../constants/assignmentStatus';

export interface IAssignment extends Document {
  orderId: string;
  deliveryId: mongoose.Types.ObjectId;
  partnerId: mongoose.Types.ObjectId;
  assignedAt: Date;
  closedAt?: Date;
  status: AssignmentStatus;
  assignmentType: string;
  reason?: string;
  notes?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema: Schema = new Schema({
  orderId: { type: String, required: true, index: true },
  deliveryId: { type: Schema.Types.ObjectId, ref: 'Delivery', required: true, index: true },
  partnerId: { type: Schema.Types.ObjectId, ref: 'DeliveryPartner', required: true, index: true },
  assignedAt: { type: Date, required: true, default: Date.now },
  closedAt: { type: Date },
  status: { type: String, required: true, default: 'ACTIVE', index: true },
  assignmentType: { type: String, required: true, default: 'MANUAL' },
  reason: { type: String },
  notes: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date }
}, { 
  timestamps: true 
});

// Setup compound indexes for common queries
AssignmentSchema.index({ deliveryId: 1, status: 1 });
AssignmentSchema.index({ partnerId: 1, status: 1 });

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
