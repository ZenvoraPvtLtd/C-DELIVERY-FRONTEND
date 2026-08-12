import { DeliveryOrder, DeliveryStatus, PaginatedDeliveries } from '@/types/delivery';
import { appEvents } from '@/lib/events';
import { repositoryFactory } from '@/repositories';
import { AuditActor } from '@/types/audit';

export const deliveryService = {
  async getActiveDeliveries(filters: any, page: number = 1, limit: number = 10): Promise<PaginatedDeliveries> {
    const repo = repositoryFactory.getDeliveryRepository();
    // In actual implementation, we'd adjust the filters to active statuses.
    // The repository handles the specific implementation details.
    return repo.getDeliveries(filters, page, limit);
  },

  async updateDeliveryStatus(orderId: string, newStatus: DeliveryStatus, actor: AuditActor | string = 'Current User', failureReason?: string): Promise<DeliveryOrder> {
    const repo = repositoryFactory.getDeliveryRepository();
    const result = await repo.updateDeliveryStatus(orderId, newStatus, actor, failureReason);
    appEvents.emit('refresh:deliveries');
    appEvents.emit('refresh:reports');
    appEvents.emit('refresh:audit');
    return result;
  },

  async getAllDeliveries(filters: any, page: number = 1, limit: number = 10): Promise<PaginatedDeliveries> {
    const repo = repositoryFactory.getDeliveryRepository();
    return repo.getDeliveries(filters, page, limit);
  },

  async getDeliveryHistory(filters: any, page: number = 1, limit: number = 10): Promise<PaginatedDeliveries> {
    const repo = repositoryFactory.getDeliveryRepository();
    return repo.getDeliveryHistory(filters, page, limit);
  },

  async getDeliveryById(orderId: string): Promise<DeliveryOrder> {
    const repo = repositoryFactory.getDeliveryRepository();
    return repo.getDeliveryById(orderId);
  }
};
