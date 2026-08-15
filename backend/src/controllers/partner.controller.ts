import { Request, Response } from 'express';
import { partnerService } from '../services/partner.service';
import { sendSuccess } from '../utils/response';
import { PartnerStatus, PartnerAvailability } from '../constants/partnerStatus';

export const getPartners = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const filters: any = {};
  if (req.query.search) filters.search = req.query.search;
  if (req.query.status) filters.status = req.query.status;
  if (req.query.availability) filters.availability = req.query.availability;

  const result = await partnerService.getPartners(filters, page, limit);
  
  return sendSuccess(res, result.data, result.meta);
};

export const getPartnerById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const partner = await partnerService.getPartnerById(id);
  return sendSuccess(res, partner);
};

export const createPartner = async (req: Request, res: Response) => {
  // Mapping the incoming snake_case DTO to camelCase for the service
  const partnerData = {
    partnerId: req.body.partner_code,
    name: req.body.full_name,
    mobile: req.body.contact_number,
    email: req.body.email_address,
    availability: req.body.availability_status || 'AVAILABLE',
    status: req.body.account_status || 'ACTIVE'
  };

  // @ts-ignore
  const partner = await partnerService.createPartner(partnerData, req.user);
  return sendSuccess(res, partner, {}, 201);
};

export const updatePartner = async (req: Request, res: Response) => {
  const id = req.params.id;
  const partnerData = {
    name: req.body.full_name,
    mobile: req.body.contact_number,
    email: req.body.email_address,
    availability: req.body.availability_status,
    status: req.body.account_status
  };

  // @ts-ignore
  const partner = await partnerService.updatePartner(id, partnerData, req.user);
  return sendSuccess(res, partner);
};

export const updatePartnerStatus = async (req: Request, res: Response) => {
  const id = req.params.id;
  const status = req.body.status as PartnerStatus;
  
  // @ts-ignore
  const partner = await partnerService.updateStatus(id, status, req.user);
  return sendSuccess(res, partner);
};

export const updatePartnerAvailability = async (req: Request, res: Response) => {
  const id = req.params.id;
  const availability = req.body.availability as PartnerAvailability;
  
  // @ts-ignore
  const partner = await partnerService.updateAvailability(id, availability, req.user);
  return sendSuccess(res, partner);
};
