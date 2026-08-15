import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/response';

export const getHealth = (req: Request, res: Response) => {
  return sendSuccess(res, {
    status: 'ok',
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
};
