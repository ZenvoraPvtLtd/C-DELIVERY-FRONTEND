import { auditLogRepository } from '../repositories/auditLog.repository';

interface CreateAuditPayload {
  actor: {
    userId: string;
    name: string;
    role: string;
  };
  action: string;
  module: string;
  recordId?: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditLogService {
  async getAuditLogs(filters: any, page: number, limit: number) {
    const result = await auditLogRepository.findLogs(filters, page, limit);
    return {
      data: result.data.map((log: any) => ({
        id: log._id?.toString() || log.id,
        timestamp: log.timestamp,
        actor: log.actor,
        action: log.action,
        module: log.module,
        recordId: log.recordId,
        oldValue: log.oldValue,
        newValue: log.newValue,
        reason: log.reason
      })),
      meta: result.meta
    };
  }

  async createAuditLog(payload: CreateAuditPayload) {
    try {
      // Redact passwords and tokens if they happen to sneak in
      const sanitize = (val: any) => {
        if (!val) return val;
        const copy = JSON.parse(JSON.stringify(val));
        if (copy.password) copy.password = '***';
        if (copy.passwordHash) copy.passwordHash = '***';
        if (copy.accessToken) copy.accessToken = '***';
        if (copy.refreshToken) copy.refreshToken = '***';
        return copy;
      };

      const sanitizedPayload = {
        ...payload,
        oldValue: sanitize(payload.oldValue),
        newValue: sanitize(payload.newValue)
      };

      return await auditLogRepository.create(sanitizedPayload);
    } catch (error) {
      console.error('Failed to create audit log, continuing without interruption:', error);
      // We swallow the error to prevent audit failures from breaking core business workflows,
      // but in a strict enterprise system, we might push it to a dead-letter queue.
    }
  }
}

export const auditLogService = new AuditLogService();
