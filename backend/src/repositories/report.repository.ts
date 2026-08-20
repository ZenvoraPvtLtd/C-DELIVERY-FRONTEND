import Delivery from '../models/Delivery.model';
import DeliveryPartner from '../models/DeliveryPartner.model';
import mongoose from 'mongoose';

export class ReportRepository {
  private buildMatchFilter(filters: any) {
    const match: any = { isDeleted: false };
    if (filters.status && filters.status !== 'ALL') {
      match.status = filters.status;
    }
    if (filters.partnerId && filters.partnerId !== 'ALL') {
      if (mongoose.Types.ObjectId.isValid(filters.partnerId)) {
        match.partnerId = new mongoose.Types.ObjectId(filters.partnerId);
      }
    }
    if (filters.dateRange && filters.dateRange !== 'ALL') {
      const now = new Date();
      let fromDate = new Date();
      switch (filters.dateRange) {
        case 'TODAY':
          fromDate.setHours(0, 0, 0, 0);
          break;
        case 'LAST_7_DAYS':
          fromDate.setDate(now.getDate() - 7);
          break;
        case 'LAST_30_DAYS':
          fromDate.setDate(now.getDate() - 30);
          break;
        default:
          fromDate = new Date(0);
      }
      match.orderDate = { $gte: fromDate };
    }
    return match;
  }

  async getKPIs(filters: any) {
    const match = this.buildMatchFilter(filters);
    
    const [deliveryKPIs, partnerStats] = await Promise.all([
      Delivery.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            pendingAssignment: { $sum: { $cond: [{ $eq: ['$status', 'WAITING_FOR_ASSIGNMENT'] }, 1, 0] } },
            assigned: { $sum: { $cond: [{ $eq: ['$status', 'ASSIGNED'] }, 1, 0] } },
            pickedUp: { $sum: { $cond: [{ $eq: ['$status', 'PICKED_UP'] }, 1, 0] } },
            outForDelivery: { $sum: { $cond: [{ $eq: ['$status', 'OUT_FOR_DELIVERY'] }, 1, 0] } },
            deliveredToday: { $sum: { $cond: [{ $eq: ['$status', 'DELIVERED'] }, 1, 0] } },
            failedOrException: { $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] } },
          }
        }
      ]),
      DeliveryPartner.aggregate([
        { $match: { status: 'ACTIVE' } },
        {
          $group: {
            _id: null,
            availablePartners: { $sum: { $cond: [{ $eq: ['$availability', 'AVAILABLE'] }, 1, 0] } },
            busyPartners: { $sum: { $cond: [{ $eq: ['$availability', 'BUSY'] }, 1, 0] } },
          }
        }
      ])
    ]);

    const dStats = deliveryKPIs[0] || { pendingAssignment: 0, assigned: 0, pickedUp: 0, outForDelivery: 0, deliveredToday: 0, failedOrException: 0 };
    const pStats = partnerStats[0] || { availablePartners: 0, busyPartners: 0 };

    return { ...dStats, ...pStats };
  }

  async getStatusDistribution(filters: any) {
    const match = this.buildMatchFilter(filters);
    
    const result = await Delivery.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $group: { _id: null, total: { $sum: '$count' }, statuses: { $push: { status: '$_id', count: '$count' } } } },
      { $unwind: '$statuses' },
      {
        $project: {
          _id: 0,
          status: '$statuses.status',
          count: '$statuses.count',
          percentage: { $multiply: [{ $divide: ['$statuses.count', { $cond: [{ $eq: ['$total', 0] }, 1, '$total'] }] }, 100] }
        }
      }
    ]);
    return result;
  }

  async getDeliveryTrend(filters: any, granularity: 'hourly' | 'daily') {
    const match = this.buildMatchFilter(filters);
    
    const dateFormat = granularity === 'hourly' ? '%Y-%m-%dT%H:00' : '%Y-%m-%d';
    
    const result = await Delivery.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$orderDate' } },
          assigned: { $sum: { $cond: [{ $in: ['$status', ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED']] }, 1, 0] } },
          outForDelivery: { $sum: { $cond: [{ $in: ['$status', ['OUT_FOR_DELIVERY', 'DELIVERED']] }, 1, 0] } },
          delivered: { $sum: { $cond: [{ $eq: ['$status', 'DELIVERED'] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] } },
          total: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          assigned: 1,
          outForDelivery: 1,
          delivered: 1,
          failed: 1,
          total: 1
        }
      }
    ]);
    return result;
  }

  async getPartnerPerformance(filters: any) {
    const match = this.buildMatchFilter(filters);
    
    const result = await Delivery.aggregate([
      { $match: { ...match, partnerId: { $ne: null } } },
      {
        $lookup: {
          from: 'deliverypartners',
          localField: 'partnerId',
          foreignField: '_id',
          as: 'partner'
        }
      },
      { $unwind: '$partner' },
      {
        $group: {
          _id: '$partner._id',
          partnerName: { $first: '$partner.name' },
          delivered: { $sum: { $cond: [{ $eq: ['$status', 'DELIVERED'] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] } },
          active: { $sum: { $cond: [{ $in: ['$status', ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY']] }, 1, 0] } },
          totalCompleted: { $sum: { $cond: [{ $in: ['$status', ['DELIVERED', 'FAILED']] }, 1, 0] } },
          deliveryTimeSum: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$status', 'DELIVERED'] }, { $ne: ['$deliveredAt', null] }, { $ne: ['$assignedAt', null] }] },
                { $subtract: ['$deliveredAt', '$assignedAt'] },
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          partnerId: '$_id',
          partnerName: 1,
          delivered: 1,
          failed: 1,
          active: 1,
          successRate: {
            $cond: [
              { $gt: ['$totalCompleted', 0] },
              { $multiply: [{ $divide: ['$delivered', '$totalCompleted'] }, 100] },
              null
            ]
          },
          avgDeliveryTimeMs: {
            $cond: [
              { $gt: ['$delivered', 0] },
              { $divide: ['$deliveryTimeSum', '$delivered'] },
              null
            ]
          }
        }
      }
    ]);
    return result;
  }

  async getTimeAnalytics(filters: any) {
    const match = this.buildMatchFilter(filters);
    
    const result = await Delivery.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          avgAssignmentToPickupMs: {
            $avg: {
              $cond: [
                { $and: [{ $ne: ['$pickupAt', null] }, { $ne: ['$assignedAt', null] }] },
                { $subtract: ['$pickupAt', '$assignedAt'] },
                null
              ]
            }
          },
          avgPickupToOutMs: {
            $avg: {
              $cond: [
                { $and: [{ $ne: ['$outForDeliveryAt', null] }, { $ne: ['$pickupAt', null] }] },
                { $subtract: ['$outForDeliveryAt', '$pickupAt'] },
                null
              ]
            }
          },
          avgOutToDeliveredMs: {
            $avg: {
              $cond: [
                { $and: [{ $ne: ['$deliveredAt', null] }, { $ne: ['$outForDeliveryAt', null] }] },
                { $subtract: ['$deliveredAt', '$outForDeliveryAt'] },
                null
              ]
            }
          },
          avgOverallMs: {
            $avg: {
              $cond: [
                { $and: [{ $ne: ['$deliveredAt', null] }, { $ne: ['$orderDate', null] }] },
                { $subtract: ['$deliveredAt', '$orderDate'] },
                null
              ]
            }
          },
          fastestOverallMs: {
            $min: {
              $cond: [
                { $and: [{ $ne: ['$deliveredAt', null] }, { $ne: ['$orderDate', null] }] },
                { $subtract: ['$deliveredAt', '$orderDate'] },
                null
              ]
            }
          },
          longestOverallMs: {
            $max: {
              $cond: [
                { $and: [{ $ne: ['$deliveredAt', null] }, { $ne: ['$orderDate', null] }] },
                { $subtract: ['$deliveredAt', '$orderDate'] },
                null
              ]
            }
          }
        }
      }
    ]);
    return result[0] || {
      avgAssignmentToPickupMs: null,
      avgPickupToOutMs: null,
      avgOutToDeliveredMs: null,
      avgOverallMs: null,
      fastestOverallMs: null,
      longestOverallMs: null
    };
  }

  async getDeliverySummary(filters: any) {
    const match = this.buildMatchFilter(filters);
    
    const result = await Delivery.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderDate' } },
          total: { $sum: 1 },
          assigned: { $sum: { $cond: [{ $eq: ['$status', 'ASSIGNED'] }, 1, 0] } },
          pickedUp: { $sum: { $cond: [{ $eq: ['$status', 'PICKED_UP'] }, 1, 0] } },
          outForDelivery: { $sum: { $cond: [{ $eq: ['$status', 'OUT_FOR_DELIVERY'] }, 1, 0] } },
          delivered: { $sum: { $cond: [{ $eq: ['$status', 'DELIVERED'] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'CANCELLED'] }, 1, 0] } },
        }
      },
      { $sort: { _id: -1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          total: 1,
          assigned: 1,
          pickedUp: 1,
          outForDelivery: 1,
          delivered: 1,
          failed: 1,
          cancelled: 1
        }
      }
    ]);
    return result;
  }
}

export const reportRepository = new ReportRepository();
