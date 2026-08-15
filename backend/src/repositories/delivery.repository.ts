import Delivery, { IDelivery } from '../models/Delivery.model';
import TimelineEvent, { ITimelineEvent } from '../models/TimelineEvent.model';
import Assignment, { IAssignment } from '../models/Assignment.model';
import { FilterQuery } from 'mongoose';

export class DeliveryRepository {
  async getDeliveries(filters: any, page: number, limit: number) {
    const query: FilterQuery<IDelivery> = { isDeleted: false };

    if (filters.search) {
      query.$or = [
        { orderId: { $regex: filters.search, $options: 'i' } },
        { customerName: { $regex: filters.search, $options: 'i' } },
        { customerPhone: { $regex: filters.search, $options: 'i' } }
      ];
    }

    if (filters.status && filters.status !== 'ALL') {
      query.status = filters.status;
    }

    if (filters.history === 'true') {
      query.status = { $in: ['DELIVERED', 'FAILED', 'CANCELLED'] };
    }

    if (filters.partner_id) {
      query.partnerId = filters.partner_id;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Delivery.find(query).sort({ orderDate: -1 }).skip(skip).limit(limit),
      Delivery.countDocuments(query)
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findByOrderId(orderId: string): Promise<IDelivery | null> {
    return await Delivery.findOne({ orderId, isDeleted: false });
  }

  async getTimeline(deliveryId: string): Promise<ITimelineEvent[]> {
    return await TimelineEvent.find({ deliveryId }).sort({ timestamp: -1 });
  }

  async getAssignments(deliveryId: string): Promise<IAssignment[]> {
    return await Assignment.find({ deliveryId }).sort({ assignedAt: -1 });
  }

  async updateDeliveryStatus(deliveryId: string, updates: Partial<IDelivery>) {
    return await Delivery.findByIdAndUpdate(deliveryId, { $set: updates }, { new: true });
  }

  async createTimelineEvent(eventData: Partial<ITimelineEvent>) {
    return await TimelineEvent.create(eventData);
  }
}

export const deliveryRepository = new DeliveryRepository();
