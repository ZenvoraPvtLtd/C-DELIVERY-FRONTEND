import AuditLog, { IAuditLog } from '../models/AuditLog.model';
import { FilterQuery } from 'mongoose';

export class AuditLogRepository {
  async create(data: Partial<IAuditLog>): Promise<IAuditLog> {
    const auditLog = new AuditLog(data);
    return auditLog.save();
  }

  async findLogs(filters: any, page: number = 1, limit: number = 20) {
    const query: FilterQuery<IAuditLog> = {};
    const skip = (page - 1) * limit;

    if (filters.action && filters.action !== 'ALL') {
      query.action = filters.action;
    }
    
    if (filters.module && filters.module !== 'ALL') {
      query.module = filters.module;
    }

    if (filters.role && filters.role !== 'ALL') {
      query['actor.role'] = filters.role;
    }

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [
        { 'actor.name': searchRegex },
        { action: searchRegex },
        { reason: searchRegex },
        { recordId: searchRegex }
      ];
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
          fromDate = new Date(0); // All time
      }
      query.timestamp = { $gte: fromDate };
    }

    const [data, total] = await Promise.all([
      AuditLog.find(query).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
      AuditLog.countDocuments(query)
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
}

export const auditLogRepository = new AuditLogRepository();
