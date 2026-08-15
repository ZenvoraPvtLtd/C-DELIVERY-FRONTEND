import { Request, Response } from 'express';
import { auditLogService } from '../services/auditLog.service';
import { sendSuccess } from '../utils/response';

export const getAuditLogs = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  
  const filters: any = {};
  if (req.query.search) filters.search = req.query.search;
  if (req.query.action) filters.action = req.query.action;
  if (req.query.module) filters.module = req.query.module;
  if (req.query.role) filters.role = req.query.role;
  if (req.query.dateRange) filters.dateRange = req.query.dateRange;

  const result = await auditLogService.getAuditLogs(filters, page, limit);
  return sendSuccess(res, result.data, result.meta);
};
