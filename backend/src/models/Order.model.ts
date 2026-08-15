import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderAmount: number;
  orderDate: Date;
  status: string; // Order-level status e.g. PREPARING, READY, HANDED_OVER
  items?: IOrderItem[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }
}, { _id: false });

const OrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  customerName: { type: String, required: true, trim: true },
  customerPhone: { type: String, required: true, trim: true, index: true },
  deliveryAddress: { type: String, required: true },
  orderAmount: { type: Number, required: true, min: 0 },
  orderDate: { type: Date, required: true, default: Date.now, index: true },
  status: { type: String, required: true, default: 'PENDING', index: true },
  items: [OrderItemSchema],
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date }
}, { 
  timestamps: true 
});

export default mongoose.model<IOrder>('Order', OrderSchema);
