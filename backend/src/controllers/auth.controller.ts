import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { auditLogService } from '../services/auditLog.service';
import { sendSuccess } from '../utils/response';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  
  await auditLogService.createAuditLog({
    actor: {
      userId: result.user.id,
      name: result.user.name,
      role: result.user.role
    },
    action: 'LOGIN',
    module: 'AUTH',
    recordId: result.user.id,
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  });

  return sendSuccess(res, {
    user: result.user,
    accessToken: result.tokens.accessToken,
    refreshToken: result.tokens.refreshToken
  });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await authService.refresh(refreshToken);
  
  return sendSuccess(res, {
    accessToken: result.tokens.accessToken,
    refreshToken: result.tokens.refreshToken
  });
};

export const getMe = async (req: Request, res: Response) => {
  // @ts-ignore - user is attached by auth middleware
  const userId = req.user.userId;
  const user = await authService.getMe(userId);
  
  return sendSuccess(res, { user });
};

export const logout = async (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user;
  if (user) {
    await auditLogService.createAuditLog({
      actor: {
        userId: user.userId,
        name: 'Unknown',
        role: user.role
      },
      action: 'LOGOUT',
      module: 'AUTH',
      recordId: user.userId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
  }

  // In a more complex architecture with Redis, we'd blacklist the refresh token here.
  // For this phase, we simply return a success to tell the frontend to clear its state.
  return sendSuccess(res, { message: 'Logged out successfully' });
};
