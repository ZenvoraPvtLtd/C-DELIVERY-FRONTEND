import { Request, Response } from 'express';
import { reportService } from '../services/report.service';
import { sendSuccess } from '../utils/response';

export const getOverview = async (req: Request, res: Response) => {
  const filters: any = {};
  if (req.query.status) filters.status = req.query.status;
  if (req.query.partnerId) filters.partnerId = req.query.partnerId;
  if (req.query.dateRange) filters.dateRange = req.query.dateRange;
  if (req.query.search) filters.search = req.query.search;

  const data = await reportService.getOverview(filters);
  
  return sendSuccess(res, data);
};
