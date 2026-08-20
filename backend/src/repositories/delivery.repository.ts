import Delivery, { IDelivery } from '../models/Delivery.model';
import TimelineEvent, { ITimelineEvent } from '../models/TimelineEvent.model';
import Assignment, { IAssignment } from '../models/Assignment.model';
import mongoose, { FilterQuery } from 'mongoose';

import DeliveryPartner from '../models/DeliveryPartner.model';

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

    if (filters.partner_id && filters.partner_id !== 'ALL' && mongoose.isValidObjectId(filters.partner_id)) {
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

  async getDashboardSummary(filters: any) {
    const matchQuery: any = { isDeleted: false };

    const [deliveryCounts, recentDeliveries, partnerCounts] = await Promise.all([
      Delivery.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Delivery.find(matchQuery, { orderId: 1, partnerId: 1, status: 1, orderDate: 1 })
        .sort({ orderDate: -1 })
        .limit(5)
        .populate('partnerId', 'name'),
      DeliveryPartner.aggregate([
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: { status: '$status', availability: '$availability' },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const countsMap: Record<string, number> = {};
    let total = 0;
    deliveryCounts.forEach((item: any) => {
      countsMap[item._id] = item.count;
      total += item.count;
    });

    const pending = countsMap['WAITING_FOR_ASSIGNMENT'] || 0;
    const active = (countsMap['ASSIGNED'] || 0) + (countsMap['PICKED_UP'] || 0) + (countsMap['OUT_FOR_DELIVERY'] || 0);
    const completed = countsMap['DELIVERED'] || 0;
    const failed = countsMap['FAILED'] || 0;

    let availablePartners = 0;
    let busyPartners = 0;
    let inactivePartners = 0;
    let totalActivePartners = 0;

    partnerCounts.forEach((p: any) => {
      if (p._id.status === 'ACTIVE') {
        totalActivePartners += p.count;
        if (p._id.availability === 'AVAILABLE') availablePartners += p.count;
        else if (p._id.availability === 'BUSY') busyPartners += p.count;
        else inactivePartners += p.count;
      } else {
        inactivePartners += p.count;
      }
    });

    const getPct = (cnt: number) => total > 0 ? Math.round((cnt / total) * 100) : 0;

    return {
      summary: {
        kpis: [
          { id: '1', label: 'Total Deliveries', value: total, trend: 'up', trendPercentage: 12, comparisonLabel: 'vs last week' },
          { id: '2', label: 'Pending Assignment', value: pending, trend: 'down', trendPercentage: 2, comparisonLabel: 'vs last week' },
          { id: '3', label: 'Active Deliveries', value: active, trend: 'up', trendPercentage: 5, comparisonLabel: 'vs last week' },
          { id: '4', label: 'Completed Today', value: completed, trend: 'up', trendPercentage: 18, comparisonLabel: 'vs last week' },
          { id: '5', label: 'Failed/Exceptions', value: failed, trend: 'down', trendPercentage: 1, comparisonLabel: 'vs last week' },
          { id: '6', label: 'Avg. Delivery Time', value: '42m', trend: 'down', trendPercentage: 5, comparisonLabel: 'vs last week' },
          { id: '7', label: 'Active Partners', value: totalActivePartners, trend: 'neutral', trendPercentage: 0, comparisonLabel: 'vs last week' },
          { id: '8', label: 'Customer Rating', value: '4.8', trend: 'up', trendPercentage: 2, comparisonLabel: 'vs last week' }
        ],
        totalDeliveries: total,
        completed,
        active,
        pending,
        failed
      },
      pipeline: [
        { status: 'WAITING_FOR_ASSIGNMENT', label: 'Waiting', count: pending, percentage: getPct(pending) },
        { status: 'ASSIGNED', label: 'Assigned', count: countsMap['ASSIGNED'] || 0, percentage: getPct(countsMap['ASSIGNED'] || 0) },
        { status: 'PICKED_UP', label: 'Picked Up', count: countsMap['PICKED_UP'] || 0, percentage: getPct(countsMap['PICKED_UP'] || 0) },
        { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', count: countsMap['OUT_FOR_DELIVERY'] || 0, percentage: getPct(countsMap['OUT_FOR_DELIVERY'] || 0) },
        { status: 'DELIVERED', label: 'Delivered', count: completed, percentage: getPct(completed) }
      ],
      trends: [
        { time: '08:00', Assigned: 12, 'Out for Delivery': 5, Delivered: 0, Failed: 0 },
        { time: '10:00', Assigned: 25, 'Out for Delivery': 15, Delivered: 10, Failed: 1 },
        { time: '12:00', Assigned: 45, 'Out for Delivery': 30, Delivered: 25, Failed: 2 },
        { time: '14:00', Assigned: 60, 'Out for Delivery': 48, Delivered: 40, Failed: 3 }
      ],
      recentDeliveries: recentDeliveries.map((d: any) => ({
        orderId: d.orderId,
        partner: d.partnerId ? (typeof d.partnerId === 'object' ? (d.partnerId as any).name : d.partnerId) : null,
        status: (d.status || '').replace(/_/g, ' '),
        time: new Date(d.orderDate).toLocaleTimeString()
      })),
      partnerAvailability: {
        available: availablePartners,
        busy: busyPartners,
        inactive: inactivePartners
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
