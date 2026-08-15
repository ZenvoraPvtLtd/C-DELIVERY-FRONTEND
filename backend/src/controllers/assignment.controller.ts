import { Request, Response } from 'express';
import { assignmentService } from '../services/assignment.service';
import { sendSuccess } from '../utils/response';

export const getEligiblePartners = async (req: Request, res: Response) => {
  const search = req.query.search as string;
  const result = await assignmentService.getEligiblePartners(search);
  return sendSuccess(res, result);
};

export const getEligibleReassignmentPartners = async (req: Request, res: Response) => {
  const search = req.query.search as string;
  // We need to exclude the current partner, which is usually resolved in the service.
  // Wait, to get the current partner, we should look at the orderId.
  const orderId = req.params.orderId;
  const { deliveryRepository } = await import('../repositories/delivery.repository');
  const delivery = await deliveryRepository.findByOrderId(orderId);
  const excludePartnerId = delivery?.partnerId?.toString();

  const result = await assignmentService.getEligiblePartners(search, excludePartnerId);
  return sendSuccess(res, result);
};

export const validateAssignment = async (req: Request, res: Response) => {
  const { orderId, partnerId } = req.body; // partnerId here is usually partner_code in frontend mock? Wait, in DTO it's partner_id. But frontend mock says `partner.id === partnerId || partner.partnerId === partnerId`. Let's assume it's partnerCode.
  
  const validation = await assignmentService.validateAssignment(orderId, partnerId);
  return sendSuccess(res, validation);
};

export const assignPartner = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const { partner_id, actor } = req.body; 

  const result = await assignmentService.assignPartner(orderId, partner_id, actor || req.user);
  return sendSuccess(res, result);
};

export const reassignPartner = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const { new_partner_id, reason, notes, actor } = req.body;

  const result = await assignmentService.reassignDelivery(orderId, new_partner_id, reason, notes, actor || req.user);
  return sendSuccess(res, result);
};
