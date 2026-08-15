import { IAuditRepository } from '../interfaces/IAuditRepository';
import { AuditFilters, PaginatedAuditLogs, AuditEventPayload, AuditLog } from '@/types/audit';
import { apiClient } from '@/lib/api/apiClient';
import { ApiListResponse, ApiResponse } from '@/lib/api/types';
import { AuditDTO } from '@/lib/api/dtos';
import { mapAuditDtoToDomain, mapDomainToAuditRequest } from '@/lib/api/mappers';

export const apiAuditRepository: IAuditRepository = {
  async getAuditLogs(filters: AuditFilters, page: number = 1, limit: number = 20): Promise<PaginatedAuditLogs> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (filters.search) params.append('search', filters.search);
    if (filters.action && filters.action !== 'ALL') params.append('action', filters.action);
    if (filters.module && filters.module !== 'ALL') params.append('module', filters.module);
    if (filters.role && filters.role !== 'ALL') params.append('role', filters.role);
    if (filters.dateRange && filters.dateRange !== 'ALL') params.append('dateRange', filters.dateRange);

    const response = await apiClient.get<ApiListResponse<AuditDTO>>(`/audit-logs?${params.toString()}`);
    
    return {
      data: response.data.map(mapAuditDtoToDomain),
      total: response.meta.total,
      page: response.meta.page,
      limit: response.meta.pageSize,
      totalPages: response.meta.totalPages
    };
  },

  async createAuditEvent(payload: AuditEventPayload): Promise<AuditLog> {
    throw new Error('Audit events cannot be created from the frontend API client. They are generated internally by backend services.');
  }
};
