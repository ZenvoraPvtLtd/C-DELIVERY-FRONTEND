import { AuditFilters, PaginatedAuditLogs, AuditEventPayload, AuditLog } from '@/types/audit';
import { repositoryFactory } from '@/repositories';

export const auditService = {
  async getAuditLogs(filters: AuditFilters, page: number = 1, limit: number = 20): Promise<PaginatedAuditLogs> {
    const repo = repositoryFactory.getAuditRepository();
    return repo.getAuditLogs(filters, page, limit);
  },

  async createAuditEvent(payload: AuditEventPayload): Promise<AuditLog> {
    const repo = repositoryFactory.getAuditRepository();
    return repo.createAuditEvent(payload);
  }
};
