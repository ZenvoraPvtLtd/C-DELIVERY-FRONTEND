import { IDeliveryRepository } from '../interfaces/IDeliveryRepository';
import { DeliveryOrder, DeliveryStatus, PaginatedDeliveries } from '@/types/delivery';
import { mockDeliveries } from '@/services/deliveries/deliveryMockData';
import { canTransition } from '@/lib/delivery/statusTransitions';
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
    } else {
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
  }
};


