import { IFailedDeliveryRepository } from '@/repositories/interfaces/IFailedDeliveryRepository';
import { mockFailedDeliveryRepository } from '@/repositories/mock/mockFailedDeliveryRepository';
import { DeliveryOrder, PaginatedDeliveries } from '@/types/delivery';
import { FailedDeliveryFilters, FailedDeliveryMetrics } from '@/types/tracking';
import { AuditActor } from '@/types/audit';

class FailedDeliveryService {
  private repository: IFailedDeliveryRepository;

  constructor(repository: IFailedDeliveryRepository) {
    this.repository = repository;
  }

  async getFailedDeliveries(filters: FailedDeliveryFilters, page: number = 1, limit: number = 10): Promise<PaginatedDeliveries> {
    return this.repository.getFailedDeliveries(filters, page, limit);
  }

  async getFailedMetrics(): Promise<FailedDeliveryMetrics> {
    return this.repository.getFailedMetrics();
  }

  async markInvestigating(orderId: string, actor?: AuditActor | string): Promise<DeliveryOrder> {
    return this.repository.markInvestigating(orderId, actor);
  }

  async addInternalNote(orderId: string, note: string, actor?: AuditActor | string): Promise<DeliveryOrder> {
    return this.repository.addInternalNote(orderId, note, actor);
  }

  async resolveFailure(orderId: string, resolution: string, actor?: AuditActor | string): Promise<DeliveryOrder> {
    return this.repository.resolveFailure(orderId, resolution, actor);
  }

  async retryDelivery(orderId: string, actor?: AuditActor | string): Promise<DeliveryOrder> {
    return this.repository.retryDelivery(orderId, actor);
  }
}

export const failedDeliveryService = new FailedDeliveryService(mockFailedDeliveryRepository);
