import { Request, Response } from 'express';
import { deliveryService } from '../services/delivery.service';
import { sendSuccess } from '../utils/response';
import { DeliveryStatus } from '../constants/deliveryStatus';

export const getDeliveries = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const filters: any = {};
  if (req.query.search) filters.search = req.query.search;
  if (req.query.status) filters.status = req.query.status;
  if (req.query.history) filters.history = req.query.history;
  if (req.query.partner_id) filters.partner_id = req.query.partner_id;

  const result = await deliveryService.getDeliveries(filters, page, limit);
  
  return sendSuccess(res, result.data, result.meta);
};

export const getDeliveryById = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const deliveryData = await deliveryService.getDeliveryById(orderId);
  return sendSuccess(res, deliveryData);
};

export const updateDeliveryStatus = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const { status, failure_reason, actor } = req.body;

  // Use the authenticated user as the actor if not provided in body (or in addition to it)
  // @ts-ignore
  const user = req.user;
  
  const newActor = actor || user;

  const result = await deliveryService.updateStatus(orderId, status as DeliveryStatus, newActor, failure_reason);
  return sendSuccess(res, result);
};
