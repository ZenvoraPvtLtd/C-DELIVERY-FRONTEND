import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditActor {
  userId: string;
  name: string;
  role: string;
}

export interface IAuditLog extends Document {
  timestamp: Date;
  actor: IAuditActor;
  action: string;
  module: string;
  recordId?: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuditActorSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true }
}, { _id: false });

const AuditLogSchema: Schema = new Schema({
  timestamp: { type: Date, required: true, default: Date.now, index: true },
  actor: { type: AuditActorSchema, required: true },
  action: { type: String, required: true, index: true },
  module: { type: String, required: true, index: true },
  recordId: { type: String, index: true },
  oldValue: { type: Schema.Types.Mixed },
  newValue: { type: Schema.Types.Mixed },
  reason: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String }
}, { 
  timestamps: true 
});

// For fast log fetching and filtering
AuditLogSchema.index({ 'actor.userId': 1 });
AuditLogSchema.index({ module: 1, timestamp: -1 });

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
