import { DeliveryOrder, DeliveryStatus, PaginatedDeliveries } from '@/types/delivery';
import { AuditActor } from '@/types/audit';

export interface IDeliveryRepository {
  getDeliveries(filters: any, page?: number, limit?: number): Promise<PaginatedDeliveries>;
  getDeliveryHistory(filters: any, page?: number, limit?: number): Promise<PaginatedDeliveries>;
  getDeliveryById(orderId: string): Promise<DeliveryOrder>;
  updateDeliveryStatus(orderId: string, status: DeliveryStatus, actor: AuditActor | string, failureReason?: string): Promise<DeliveryOrder>;
}
