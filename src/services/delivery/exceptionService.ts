import { DeliveryOrder } from '@/types/delivery';
import { mockDeliveries } from '../deliveries/deliveryMockData';
import { mockPartners } from '../partners/partnerMockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, 0));

export const exceptionService = {
  async markDeliveryFailed(orderId: string, reason: string, notes?: string, actor: string = 'Current User'): Promise<DeliveryOrder> {
    await delay(600);
    
    const orderIndex = mockDeliveries.findIndex(d => d.id === orderId);
    if (orderIndex === -1) throw new Error('Order not found');
    const order = mockDeliveries[orderIndex];

    const validActiveStatuses = ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'];
    if (!validActiveStatuses.includes(order.status)) {
      throw new Error('Delivery status has changed. Please refresh and try again.');
    }

    const now = new Date().toISOString();

    // 1. Free up current partner and close assignment
    const currentPartnerId = order.partnerId;
    if (currentPartnerId) {
      const pIndex = mockPartners.findIndex(p => p.id === currentPartnerId);
      if (pIndex > -1) {
        mockPartners[pIndex].availability = 'AVAILABLE';
      }

      const activeAssignment = order.assignmentHistory.find(a => a.status === 'ACTIVE');
      if (activeAssignment) {
        activeAssignment.status = 'CLOSED';
        activeAssignment.closedAt = now;
        activeAssignment.reason = 'Delivery Failed';
      }
    }

    // 2. Mark order as failed
    order.status = 'FAILED';
    order.failureReason = reason;
    order.failureNotes = notes;
    order.failedAt = now;

    // 3. Record to timeline
    order.timeline.push({
      id: Math.random().toString(36).substring(7),
      status: 'FAILED',
      timestamp: now,
      actor,
      notes: `${reason}${notes ? ` - ${notes}` : ''}`
    });

    return order;
  }
};


