import { IFailedDeliveryRepository } from '../interfaces/IFailedDeliveryRepository';
import { DeliveryOrder, PaginatedDeliveries } from '@/types/delivery';
import { FailedDeliveryFilters, FailedDeliveryMetrics } from '@/types/tracking';
import { mockDeliveries } from '@/services/deliveries/deliveryMockData';
import { AuditActor } from '@/types/audit';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, 0));

export const mockFailedDeliveryRepository: IFailedDeliveryRepository = {
  async getFailedDeliveries(filters: FailedDeliveryFilters, page: number = 1, limit: number = 10): Promise<PaginatedDeliveries> {
    await delay(300);
    
    let filtered = mockDeliveries.filter(d => d.status === 'FAILED');

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(d => 
        d.orderId.toLowerCase().includes(q) || 
        d.customerName.toLowerCase().includes(q) || 
        d.deliveryAddress.toLowerCase().includes(q) ||
        (d.partnerId && d.partnerId.toLowerCase().includes(q)) ||
        (d.failureReason && d.failureReason.toLowerCase().includes(q)) ||
        d.customerPhone.includes(q)
      );
    }

    if (filters.failureStatus && filters.failureStatus !== 'ALL') {
      filtered = filtered.filter(d => (d.failureStatus || 'OPEN') === filters.failureStatus);
    }

    if (filters.failureReason && filters.failureReason !== 'ALL') {
      filtered = filtered.filter(d => d.failureReason === filters.failureReason);
    }

    if (filters.partnerId && filters.partnerId !== 'ALL') {
      filtered = filtered.filter(d => d.partnerId === filters.partnerId);
    }

    if (filters.dateRange && filters.dateRange !== 'ALL') {
      const now = new Date();
      filtered = filtered.filter(d => {
        if (!d.failedAt) return false;
        const failedDate = new Date(d.failedAt);
        if (filters.dateRange === 'TODAY') {
          return failedDate.toDateString() === now.toDateString();
        } else if (filters.dateRange === 'YESTERDAY') {
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          return failedDate.toDateString() === yesterday.toDateString();
        } else if (filters.dateRange === 'LAST_7_DAYS') {
          const diffTime = Math.abs(now.getTime() - failedDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          return diffDays <= 7;
        }
        return true;
      });
    }

    filtered.sort((a, b) => {
      const dateA = a.failedAt ? new Date(a.failedAt).getTime() : 0;
      const dateB = b.failedAt ? new Date(b.failedAt).getTime() : 0;
      return dateB - dateA;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginatedData = filtered.slice(start, start + limit);

    return { data: paginatedData, total, page, limit, totalPages };
  },

  async getFailedMetrics(): Promise<FailedDeliveryMetrics> {
    await delay(200);
    const failedDeliveries = mockDeliveries.filter(d => d.status === 'FAILED');
    
    let totalFailed = failedDeliveries.length;
    let failedToday = 0;
    let underInvestigation = 0;
    let resolved = 0;

    const now = new Date();

    for (const d of failedDeliveries) {
      if (d.failedAt) {
        const failedDate = new Date(d.failedAt);
        if (failedDate.toDateString() === now.toDateString()) {
          failedToday++;
        }
      }
      if (d.failureStatus === 'INVESTIGATING') underInvestigation++;
      if (d.failureStatus === 'RESOLVED') resolved++;
    }

    return { totalFailed, failedToday, underInvestigation, resolved };
  },

  async markInvestigating(orderId: string, actor?: AuditActor | string): Promise<DeliveryOrder> {
    await delay(300);
    const order = mockDeliveries.find(d => d.id === orderId || d.orderId === orderId);
    if (!order) throw new Error('Order not found');
    
    order.failureStatus = 'INVESTIGATING';
    order.timeline.push({
      id: Math.random().toString(36).substring(7),
      status: 'FAILED',
      timestamp: new Date().toISOString(),
      actor: typeof actor === 'string' ? actor : actor?.name || 'System',
      notes: 'Status changed to Investigating'
    });
    
    return { ...order };
  },

  async addInternalNote(orderId: string, note: string, actor?: AuditActor | string): Promise<DeliveryOrder> {
    await delay(300);
    const order = mockDeliveries.find(d => d.id === orderId || d.orderId === orderId);
    if (!order) throw new Error('Order not found');
    
    const timestamp = new Date().toLocaleString();
    const actorName = typeof actor === 'string' ? actor : actor?.name || 'System';
    const newNoteStr = `[${timestamp}] ${actorName}: ${note}`;
    
    if (order.internalNotes) {
      order.internalNotes = order.internalNotes + '\n' + newNoteStr;
    } else {
      order.internalNotes = newNoteStr;
    }
    
    return { ...order };
  },

  async resolveFailure(orderId: string, resolution: string, actor?: AuditActor | string): Promise<DeliveryOrder> {
    await delay(300);
    const order = mockDeliveries.find(d => d.id === orderId || d.orderId === orderId);
    if (!order) throw new Error('Order not found');
    
    order.failureStatus = 'RESOLVED';
    order.resolution = resolution;
    order.resolvedAt = new Date().toISOString();
    
    order.timeline.push({
      id: Math.random().toString(36).substring(7),
      status: 'FAILED',
      timestamp: new Date().toISOString(),
      actor: typeof actor === 'string' ? actor : actor?.name || 'System',
      notes: `Resolved: ${resolution}`
    });
    
    return { ...order };
  },

  async retryDelivery(orderId: string, actor?: AuditActor | string): Promise<DeliveryOrder> {
    await delay(300);
    const order = mockDeliveries.find(d => d.id === orderId || d.orderId === orderId);
    if (!order) throw new Error('Order not found');
    
    order.status = 'WAITING_FOR_ASSIGNMENT';
    order.failureStatus = undefined;
    
    order.timeline.push({
      id: Math.random().toString(36).substring(7),
      status: 'WAITING_FOR_ASSIGNMENT',
      timestamp: new Date().toISOString(),
      actor: typeof actor === 'string' ? actor : actor?.name || 'System',
      notes: 'Delivery Retry Initiated'
    });
    
    return { ...order };
  }
};
