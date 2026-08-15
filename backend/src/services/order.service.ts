import { orderRepository } from '../repositories/order.repository';
import { deliveryRepository } from '../repositories/delivery.repository';
import { NotFoundError } from '../utils/errors';

export class OrderService {
  async getOrders(filters: any, page: number, limit: number) {
    return orderRepository.getOrders(filters, page, limit);
  }

  async getOrderById(orderId: string) {
    const order = await orderRepository.getOrderById(orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    return order;
  }
}

export const orderService = new OrderService();
