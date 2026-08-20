import mongoose, { Schema, Document } from 'mongoose';
import { PartnerStatus, PartnerAvailability } from '../constants/partnerStatus';

export interface IDeliveryPartner extends Document {
  partnerId: string;
  name: string;
  mobile: string;
  email?: string;
  availability: PartnerAvailability;
  status: PartnerStatus;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  todaysDeliveries?: number; // Virtual or computed field
}

const DeliveryPartnerSchema: Schema = new Schema({
  partnerId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true, index: true },
  mobile: { type: String, required: true, unique: true, trim: true, index: true },
  email: { type: String, trim: true, lowercase: true, index: { unique: true, sparse: true } },
  availability: { type: String, required: true, default: 'AVAILABLE', index: true },
  status: { type: String, required: true, default: 'ACTIVE', index: true },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date }
}, { 
  timestamps: true 
});

DeliveryPartnerSchema.index({ isDeleted: 1, status: 1, availability: 1 });
DeliveryPartnerSchema.index({ isDeleted: 1, createdAt: -1 });

export default mongoose.model<IDeliveryPartner>('DeliveryPartner', DeliveryPartnerSchema);
