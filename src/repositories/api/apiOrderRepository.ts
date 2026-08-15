import { IOrderRepository } from '../interfaces/IOrderRepository';
import { OrderDomain } from '@/types/order';
import { apiClient } from '@/lib/api/apiClient';
import { ApiResponse } from '@/lib/api/types';

export const apiOrderRepository: IOrderRepository = {
  async getOrderById(orderId: string): Promise<OrderDomain> {
    const response = await apiClient.get<ApiResponse<any>>(`/orders/${orderId}`);
    const data = response.data;
    return {
      id: data._id || data.id,
      orderId: data.orderId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      deliveryAddress: data.deliveryAddress,
      orderAmount: data.orderAmount,
      orderDate: data.orderDate,
      status: data.status,
      items: data.items || []
    };
  }
};
