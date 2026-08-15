import mongoose, { Schema, Document } from 'mongoose';
import { Role } from '../constants/roles';
import { Permission } from '../constants/permissions';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  permissions: Permission[];
  isActive: boolean;
  lastLoginAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true },
  permissions: [{ type: String }],
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date }
}, { 
  timestamps: true 
});

export default mongoose.model<IUser>('User', UserSchema);
