import { OrderDomain } from '@/types/order';

export interface IOrderRepository {
  getOrderById(orderId: string): Promise<OrderDomain>;
}
