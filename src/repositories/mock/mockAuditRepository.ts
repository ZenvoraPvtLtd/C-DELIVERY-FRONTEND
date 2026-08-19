import { IAuditRepository } from '../interfaces/IAuditRepository';
import { AuditFilters, PaginatedAuditLogs, AuditEventPayload, AuditLog } from '@/types/audit';
import { mockAuditLogs } from '@/services/audit/auditMockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, 0));

export const mockAuditRepository: IAuditRepository = {
  async getAuditLogs(filters: AuditFilters, page: number = 1, limit: number = 20): Promise<PaginatedAuditLogs> {
    

    let filtered = [...mockAuditLogs];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.actor.name.toLowerCase().includes(q) ||
        (log.recordId && log.recordId.toLowerCase().includes(q)) ||
        (log.reason && log.reason.toLowerCase().includes(q))
      );
    }

    if (filters.action && filters.action !== 'ALL') {
      filtered = filtered.filter(log => log.action === filters.action);
    }

    if (filters.module && filters.module !== 'ALL') {
      filtered = filtered.filter(log => log.module === filters.module);
    }

    if (filters.role && filters.role !== 'ALL') {
      filtered = filtered.filter(log => log.actor.role === filters.role);
    }

    if (filters.dateRange && filters.dateRange !== 'ALL') {
      const now = new Date();
      let threshold = new Date();
      
      switch (filters.dateRange) {
        case 'TODAY':
          threshold.setHours(0, 0, 0, 0);
          break;
        case 'YESTERDAY':
          threshold.setDate(threshold.getDate() - 1);
          threshold.setHours(0, 0, 0, 0);
          break;
        case 'LAST_7_DAYS':
          threshold.setDate(threshold.getDate() - 7);
          break;
        case 'LAST_30_DAYS':
          threshold.setDate(threshold.getDate() - 30);
          break;
      }
      
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        if (filters.dateRange === 'YESTERDAY') {
          const endOfYesterday = new Date(threshold);
          endOfYesterday.setHours(23, 59, 59, 999);
          return logDate >= threshold && logDate <= endOfYesterday;
        }
        return logDate >= threshold;
      });
    }

    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginatedData = filtered.slice(start, start + limit);

    return { data: paginatedData, total, page, limit, totalPages };
  },

  async createAuditEvent(payload: AuditEventPayload): Promise<AuditLog> {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substring(7),
      ...payload,
      timestamp: new Date().toISOString()
    };
    
    mockAuditLogs.unshift(newLog);
    return newLog;
  }
};



