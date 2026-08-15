import { IOrderRepository } from '../interfaces/IOrderRepository';
import { OrderDomain } from '@/types/order';

const mockOrders: OrderDomain[] = [
  {
    id: 'ORD-1001',
    orderId: 'ORD-1001',
    customerName: 'John Doe',
    customerPhone: '+1234567890',
    deliveryAddress: '123 Main St, Cityville',
    orderAmount: 45.50,
    orderDate: new Date().toISOString(),
    status: 'PREPARING'
  },
  {
    id: 'ORD-1002',
    orderId: 'ORD-1002',
    customerName: 'Jane Smith',
    customerPhone: '+1987654321',
    deliveryAddress: '456 Oak Ave, Townsburg',
    orderAmount: 32.00,
    orderDate: new Date(Date.now() - 3600000).toISOString(),
    status: 'READY'
  },
  {
    id: 'ORD-1003',
    orderId: 'ORD-1003',
    customerName: 'Bob Johnson',
    customerPhone: '+1555555555',
    deliveryAddress: '789 Pine Rd, Villageton',
    orderAmount: 112.75,
    orderDate: new Date(Date.now() - 7200000).toISOString(),
    status: 'HANDED_OVER'
  },
  {
    id: 'ORD-1004',
    orderId: 'ORD-1004',
    customerName: 'Alice Brown',
    customerPhone: '+1444444444',
    deliveryAddress: '321 Elm St, Hamlet',
    orderAmount: 15.25,
    orderDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'HANDED_OVER'
  },
  {
    id: 'ORD-1005',
    orderId: 'ORD-1005',
    customerName: 'Charlie Davis',
    customerPhone: '+1666666666',
    deliveryAddress: '654 Maple Dr, Countryside',
    orderAmount: 55.00,
    orderDate: new Date(Date.now() - 86400000).toISOString(),
    status: 'HANDED_OVER'
  }
];

export const mockOrderRepository: IOrderRepository = {
  async getOrderById(orderId: string): Promise<OrderDomain> {
    const order = mockOrders.find(o => o.orderId === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }
};
