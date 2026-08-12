import { DeliveryOrder } from '@/types/delivery';
import { DeliveryPartner } from '@/types/partner';
import { repositoryFactory } from '@/repositories';
import { AuditActor } from '@/types/audit';
import { appEvents } from '@/lib/events';

export const reassignmentService = {
  async getEligiblePartners(orderId: string, search?: string): Promise<{ partner: DeliveryPartner; isEligible: boolean; reason?: string }[]> {
    const repo = repositoryFactory.getAssignmentRepository();
    return repo.getEligibleReassignmentPartners(orderId, search);
  },

  async reassignDelivery(orderId: string, newPartnerId: string, reason: string, notes?: string, actor?: AuditActor | string): Promise<DeliveryOrder> {
    const repo = repositoryFactory.getAssignmentRepository();
    const result = await repo.reassignDelivery(orderId, newPartnerId, reason, notes, actor);
    appEvents.emit('refresh:assignments');
    appEvents.emit('refresh:deliveries');
    appEvents.emit('refresh:partners');
    appEvents.emit('refresh:audit');
    return result;
  }
};
