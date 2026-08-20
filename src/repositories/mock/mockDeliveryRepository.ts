import { IDeliveryRepository } from '../interfaces/IDeliveryRepository';
import { DeliveryOrder, DeliveryStatus, PaginatedDeliveries } from '@/types/delivery';
import { mockDeliveries } from '@/services/deliveries/deliveryMockData';
import { mockPartners } from '@/services/partners/partnerMockData';
import { auditService } from '@/services/audit/auditService';
import { AuditActor } from '@/types/audit';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, 0));

export const mockDeliveryRepository: IDeliveryRepository = {
  async getDeliveries(filters: any, page: number = 1, limit: number = 10): Promise<PaginatedDeliveries> {
    
    
    let filtered = [...mockDeliveries];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(d => 
        d.orderId.toLowerCase().includes(q) || 
        d.customerName.toLowerCase().includes(q) || 
        d.deliveryAddress.toLowerCase().includes(q) ||
        (d.partnerId && d.partnerId.toLowerCase().includes(q))
      );
    }

    if (filters.status && filters.status !== 'ALL') {
      filtered = filtered.filter(d => d.status === filters.status);
    } else if (!filters.status) {
      filtered = filtered.filter(d => !['DELIVERED', 'FAILED', 'CANCELLED'].includes(d.status));
    }

    if (filters.partnerId) {
      filtered = filtered.filter(d => d.partnerId === filters.partnerId);
    }

    filtered.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginatedData = filtered.slice(start, start + limit);

    return { data: paginatedData, total, page, limit, totalPages };
  },

  async getDeliveryHistory(filters: any, page: number = 1, limit: number = 10): Promise<PaginatedDeliveries> {
    
    
    let filtered = mockDeliveries.filter(d => ['DELIVERED', 'FAILED', 'CANCELLED'].includes(d.status));

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(d => 
        d.orderId.toLowerCase().includes(q) || 
        d.customerName.toLowerCase().includes(q) || 
        d.deliveryAddress.toLowerCase().includes(q) ||
        (d.partnerId && d.partnerId.toLowerCase().includes(q))
      );
    }

    if (filters.status && filters.status !== 'ALL') {
      filtered = filtered.filter(d => d.status === filters.status);
    }

    filtered.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginatedData = filtered.slice(start, start + limit);

    return { data: paginatedData, total, page, limit, totalPages };
  },

  async getDeliveryById(orderId: string): Promise<DeliveryOrder> {
    
    const order = mockDeliveries.find(d => d.orderId === orderId || d.id === orderId);
    if (!order) throw new Error('Delivery not found');
    return order;
  },

  async updateDeliveryStatus(orderId: string, newStatus: DeliveryStatus, actor: AuditActor | string = 'Current User', failureReason?: string): Promise<DeliveryOrder> {
    
    const index = mockDeliveries.findIndex(d => d.id === orderId);
    if (index === -1) throw new Error('Delivery not found');

    const order = mockDeliveries[index];
    const oldStatus = order.status;
    const now = new Date().toISOString();

    order.status = newStatus;
    
    if (newStatus === 'PICKED_UP') order.pickupAt = now;
    if (newStatus === 'OUT_FOR_DELIVERY') order.outForDeliveryAt = now;
    if (newStatus === 'DELIVERED') order.deliveredAt = now;
    if (newStatus === 'FAILED') {
      order.failedAt = now;
      order.failureReason = failureReason || 'Unknown';
    }

    order.timeline.push({
      id: Math.random().toString(36).substring(7),
      status: newStatus,
      timestamp: now,
      actor: typeof actor === 'string' ? actor : actor.name,
      notes: failureReason
    });

    if (actor) {
      const actualActor = typeof actor === 'string' ? { userId: 'SYS', name: actor, role: 'SYSTEM' } : actor;
      let actionType = 'UPDATE_DELIVERY_STATUS';
      if (newStatus === 'DELIVERED') actionType = 'COMPLETE_DELIVERY';
      if (newStatus === 'FAILED') actionType = 'MARK_DELIVERY_FAILED';
      
      auditService.createAuditEvent({
        actor: actualActor as any, 
        action: actionType as any, 
        module: 'DELIVERY', 
        recordId: orderId,
        oldValue: { status: oldStatus }, 
        newValue: { status: newStatus }, 
        reason: failureReason
      });
    }

    return order;
  },

  async getDashboardSummary(filters: any): Promise<any> {
    await delay(200);
    const total = mockDeliveries.length;
    const pending = mockDeliveries.filter(d => d.status === 'WAITING_FOR_ASSIGNMENT').length;
    const active = mockDeliveries.filter(d => ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(d.status)).length;
    const completed = mockDeliveries.filter(d => d.status === 'DELIVERED').length;
    const failed = mockDeliveries.filter(d => d.status === 'FAILED').length;

    const totalActivePartners = mockPartners.filter(p => p.status === 'ACTIVE').length;
    const availablePartners = mockPartners.filter(p => p.status === 'ACTIVE' && p.availability === 'AVAILABLE').length;
    const busyPartners = mockPartners.filter(p => p.status === 'ACTIVE' && p.availability === 'BUSY').length;
    const inactivePartners = mockPartners.filter(p => p.availability === 'INACTIVE' || p.status !== 'ACTIVE').length;

    const getPct = (cnt: number) => total > 0 ? Math.round((cnt / total) * 100) : 0;

    const sortedRecent = [...mockDeliveries].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).slice(0, 5);

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
        { status: 'ASSIGNED', label: 'Assigned', count: mockDeliveries.filter(d => d.status === 'ASSIGNED').length, percentage: getPct(mockDeliveries.filter(d => d.status === 'ASSIGNED').length) },
        { status: 'PICKED_UP', label: 'Picked Up', count: mockDeliveries.filter(d => d.status === 'PICKED_UP').length, percentage: getPct(mockDeliveries.filter(d => d.status === 'PICKED_UP').length) },
        { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', count: mockDeliveries.filter(d => d.status === 'OUT_FOR_DELIVERY').length, percentage: getPct(mockDeliveries.filter(d => d.status === 'OUT_FOR_DELIVERY').length) },
        { status: 'DELIVERED', label: 'Delivered', count: completed, percentage: getPct(completed) }
      ],
      trends: [
        { time: '08:00', Assigned: 12, 'Out for Delivery': 5, Delivered: 0, Failed: 0 },
        { time: '10:00', Assigned: 25, 'Out for Delivery': 15, Delivered: 10, Failed: 1 },
        { time: '12:00', Assigned: 45, 'Out for Delivery': 30, Delivered: 25, Failed: 2 },
        { time: '14:00', Assigned: 60, 'Out for Delivery': 48, Delivered: 40, Failed: 3 }
      ],
      recentDeliveries: sortedRecent.map(d => ({
        orderId: d.orderId,
        partner: d.partnerId || null,
        status: d.status.replace(/_/g, ' '),
        time: new Date(d.orderDate).toLocaleTimeString()
      })),
      partnerAvailability: {
        available: availablePartners,
        busy: busyPartners,
        inactive: inactivePartners
      }
    };
  }
};
