import { IAssignmentRepository } from '../interfaces/IAssignmentRepository';
import { DeliveryOrder, PaginatedDeliveries } from '@/types/delivery';
import { AssignmentFilters, AssignmentValidationResult } from '@/types/assignment';
import { DeliveryPartner } from '@/types/partner';
import { mockDeliveries } from '@/services/deliveries/deliveryMockData';
import { mockPartners } from '@/services/partners/partnerMockData';
import { auditService } from '@/services/audit/auditService';
import { AuditActor } from '@/types/audit';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, 0));

export const mockAssignmentRepository: IAssignmentRepository = {
  async getPendingAssignments(filters: AssignmentFilters, page: number = 1, limit: number = 10): Promise<PaginatedDeliveries> {
    await delay(500);
    
    let filtered = mockDeliveries.filter(d => d.status === 'WAITING_FOR_ASSIGNMENT');

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(d => 
        d.orderId.toLowerCase().includes(q) || 
        d.customerName.toLowerCase().includes(q) || 
        d.deliveryAddress.toLowerCase().includes(q)
      );
    }
    
    if (filters.priority && filters.priority !== 'ALL') {
      filtered = filtered.filter(d => d.priority === filters.priority);
    }

    filtered.sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime());

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginatedData = filtered.slice(start, start + limit);

    return { data: paginatedData, total, page, limit, totalPages };
  },

  async getPartnersForAssignment(search?: string): Promise<{ partner: DeliveryPartner; isEligible: boolean; reason?: string }[]> {
    await delay(400);
    
    let activePartners = mockPartners.filter(p => p.status === 'ACTIVE');
    
    if (search) {
      const q = search.toLowerCase();
      activePartners = activePartners.filter(p => 
        p.name.toLowerCase().includes(q) || p.partnerId.toLowerCase().includes(q)
      );
    }
    
    return activePartners.map(partner => {
      let isEligible = true;
      let reason: string | undefined;

      if (partner.availability !== 'AVAILABLE') {
        isEligible = false;
        reason = `Partner is currently ${partner.availability.toLowerCase()}`;
      }

      return { partner, isEligible, reason };
    });
  },

  async validateAssignment(orderId: string, partnerId: string): Promise<AssignmentValidationResult> {
    await delay(300);
    const order = mockDeliveries.find(d => d.id === orderId);
    if (!order) return { isValid: false, reason: 'Order not found' };
    if (order.status !== 'WAITING_FOR_ASSIGNMENT') return { isValid: false, reason: 'Order is not waiting for assignment' };
    
    const partner = mockPartners.find(p => p.id === partnerId || p.partnerId === partnerId);
    if (!partner) return { isValid: false, reason: 'Partner not found' };
    if (partner.status !== 'ACTIVE') return { isValid: false, reason: 'Partner is inactive' };
    if (partner.availability !== 'AVAILABLE') return { isValid: false, reason: 'Partner is not available' };

    return { isValid: true };
  },

  async assignPartner(orderId: string, partnerId: string, actor?: AuditActor | string): Promise<DeliveryOrder> {
    await delay(800);
    
    const validation = await this.validateAssignment(orderId, partnerId);
    if (!validation.isValid) throw new Error(validation.reason || 'Invalid assignment');

    const index = mockDeliveries.findIndex(d => d.id === orderId);
    const order = mockDeliveries[index];
    
    const partnerIndex = mockPartners.findIndex(p => p.id === partnerId || p.partnerId === partnerId);
    const partner = mockPartners[partnerIndex];
    
    const now = new Date().toISOString();

    order.partnerId = partner.partnerId;
    order.status = 'ASSIGNED';
    order.assignedAt = now;

    order.assignmentHistory.push({
      id: Math.random().toString(36).substring(7),
      orderId: order.id,
      partnerId: partner.partnerId,
      assignedAt: now,
      status: 'ACTIVE'
    });

    order.timeline.push({
      id: Math.random().toString(36).substring(7),
      status: 'ASSIGNED',
      timestamp: now,
      actor: typeof actor === 'string' ? actor : (actor?.name || 'System'),
      notes: `Assigned to ${partner.name}`
    });

    partner.availability = 'BUSY';
    if (partner.todaysDeliveries !== undefined) {
      partner.todaysDeliveries += 1;
    }

    if (actor) {
      const actualActor = typeof actor === 'string' ? { userId: 'SYS', name: actor, role: 'SYSTEM' } : actor;
      auditService.createAuditEvent({
        actor: actualActor as any, 
        action: 'ASSIGN_DELIVERY', 
        module: 'ASSIGNMENTS', 
        recordId: orderId,
        oldValue: { status: 'WAITING_FOR_ASSIGNMENT', partnerId: null },
        newValue: { status: 'ASSIGNED', partnerId: partner.partnerId }
      });
    }

    return order;
  },

  async getEligibleReassignmentPartners(orderId: string, search?: string): Promise<{ partner: DeliveryPartner; isEligible: boolean; reason?: string }[]> {
    await delay(400);
    const order = mockDeliveries.find(d => d.id === orderId);
    if (!order) throw new Error('Order not found');

    let partners = mockPartners.filter(p => p.status === 'ACTIVE' && p.partnerId !== order.partnerId);

    if (search) {
      const q = search.toLowerCase();
      partners = partners.filter(p => 
        p.name.toLowerCase().includes(q) || p.partnerId.toLowerCase().includes(q)
      );
    }
    
    return partners.map(partner => {
      let isEligible = true;
      let reason: string | undefined;

      if (partner.availability !== 'AVAILABLE') {
        isEligible = false;
        reason = `Partner is currently ${partner.availability.toLowerCase()}`;
      }

      return { partner, isEligible, reason };
    });
  },

  async reassignDelivery(orderId: string, newPartnerId: string, reason: string, notes?: string, actor?: AuditActor | string): Promise<DeliveryOrder> {
    await delay(800);
    const orderIndex = mockDeliveries.findIndex(d => d.id === orderId);
    if (orderIndex === -1) throw new Error('Order not found');
    const order = mockDeliveries[orderIndex];

    const oldPartnerId = order.partnerId;
    if (oldPartnerId === newPartnerId) throw new Error('New partner must be different from current partner');
    
    const newPartnerIndex = mockPartners.findIndex(p => p.id === newPartnerId || p.partnerId === newPartnerId);
    if (newPartnerIndex === -1) throw new Error('New partner not found');
    const newPartner = mockPartners[newPartnerIndex];

    if (newPartner.status !== 'ACTIVE' || newPartner.availability !== 'AVAILABLE') {
      throw new Error('New partner is not eligible for assignment');
    }

    const now = new Date().toISOString();

    const currentAssignment = order.assignmentHistory.find(a => a.status === 'ACTIVE');
    if (currentAssignment) {
      currentAssignment.status = 'SUPERSEDED';
      currentAssignment.closedAt = now;
      currentAssignment.reason = reason;
      currentAssignment.notes = notes;
    }

    if (oldPartnerId) {
      const oldPartnerIndex = mockPartners.findIndex(p => p.partnerId === oldPartnerId);
      if (oldPartnerIndex !== -1) {
        mockPartners[oldPartnerIndex].availability = 'AVAILABLE';
      }
    }

    order.partnerId = newPartner.partnerId;
    order.status = 'ASSIGNED';
    order.assignedAt = now;
    
    order.assignmentHistory.push({
      id: Math.random().toString(36).substring(7),
      orderId: order.id,
      partnerId: newPartner.partnerId,
      assignedAt: now,
      status: 'ACTIVE',
      reason: 'Reassignment'
    });

    order.timeline.push({
      id: Math.random().toString(36).substring(7),
      status: 'ASSIGNED',
      timestamp: now,
      actor: typeof actor === 'string' ? actor : (actor?.name || 'System'),
      notes: `Reassigned to ${newPartner.name}. Reason: ${reason}`
    });

    newPartner.availability = 'BUSY';
    if (newPartner.todaysDeliveries !== undefined) {
      newPartner.todaysDeliveries += 1;
    }

    if (actor) {
      const actualActor = typeof actor === 'string' ? { userId: 'SYS', name: actor, role: 'SYSTEM' } : actor;
      auditService.createAuditEvent({
        actor: actualActor as any, 
        action: 'REASSIGN_DELIVERY', 
        module: 'ASSIGNMENTS', 
        recordId: orderId,
        oldValue: { partnerId: oldPartnerId }, 
        newValue: { partnerId: newPartner.partnerId }, 
        reason
      });
    }

    return order;
  }
};


