import Order from '../models/Order.model';
import { FilterQuery } from 'mongoose';

export class OrderRepository {
  async getOrderById(orderId: string) {
    return Order.findOne({ orderId, isDeleted: false });
  }

  async getOrders(filters: FilterQuery<any>, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const query: any = { isDeleted: false };
    
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [
        { orderId: searchRegex },
        { customerName: searchRegex },
        { customerPhone: searchRegex }
      ];
    }
    
    if (filters.status) query.status = filters.status;

    const [data, total] = await Promise.all([
      Order.find(query).sort({ orderDate: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(query)
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

export const orderRepository = new OrderRepository();
