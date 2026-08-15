import { Response } from 'express';

export const sendSuccess = (res: Response, data: any = {}, meta: any = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    meta: Object.keys(meta).length > 0 ? meta : undefined
  });
};
