import { AuditFilters, PaginatedAuditLogs, AuditEventPayload, AuditLog } from '@/types/audit';

export interface IAuditRepository {
  getAuditLogs(filters: AuditFilters, page?: number, limit?: number): Promise<PaginatedAuditLogs>;
  createAuditEvent(payload: AuditEventPayload): Promise<AuditLog>;
}
