import { DeliveryOrder, PaginatedDeliveries } from '@/types/delivery';
import { FailedDeliveryFilters, FailedDeliveryMetrics } from '@/types/tracking';
import { AuditActor } from '@/types/audit';

export interface IFailedDeliveryRepository {
  getFailedDeliveries(filters: FailedDeliveryFilters, page?: number, limit?: number): Promise<PaginatedDeliveries>;
  getFailedMetrics(): Promise<FailedDeliveryMetrics>;
  markInvestigating(orderId: string, actor?: AuditActor | string): Promise<DeliveryOrder>;
  addInternalNote(orderId: string, note: string, actor?: AuditActor | string): Promise<DeliveryOrder>;
  resolveFailure(orderId: string, resolution: string, actor?: AuditActor | string): Promise<DeliveryOrder>;
  retryDelivery(orderId: string, actor?: AuditActor | string): Promise<DeliveryOrder>;
}
