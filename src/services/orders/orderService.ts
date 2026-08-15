import { DeliveryOrder } from '@/types/delivery';
import { repositoryFactory } from '@/repositories';

export const orderService = {
  async getOrderDetails(orderId: string): Promise<DeliveryOrder> {
    const orderRepo = repositoryFactory.getOrderRepository();
    const deliveryRepo = repositoryFactory.getDeliveryRepository();

    // The order repository fetches pure order domain data.
    const order = await orderRepo.getOrderById(orderId);
    
    // The delivery repository fetches delivery, assignments, and timeline.
    const delivery = await deliveryRepo.getDeliveryById(orderId);

    // Merge them into the DeliveryOrder DTO expected by the UI
    return {
      ...delivery,
      // Priority to order domain data where it overlaps, ensuring it's the source of truth
      orderId: order.orderId,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      orderAmount: order.orderAmount,
      orderDate: order.orderDate
    };
  }
};
