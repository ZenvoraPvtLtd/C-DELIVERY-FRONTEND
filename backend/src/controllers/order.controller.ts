import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { sendSuccess } from '../utils/response';

export const getOrders = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const filters: any = {};
  if (req.query.search) filters.search = req.query.search;
  if (req.query.status) filters.status = req.query.status;

  const result = await orderService.getOrders(filters, page, limit);
  return sendSuccess(res, result.data, result.meta);
};

export const getOrderById = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const order = await orderService.getOrderById(orderId);
  return sendSuccess(res, order);
};
