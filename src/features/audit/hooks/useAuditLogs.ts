"use client";
import { useState, useCallback, useEffect } from 'react';
import { AuditFilters, PaginatedAuditLogs, AuditLog } from '@/types/audit';
import { auditService } from '@/services/audit/auditService';
import { useAppEvent } from '@/lib/events';

export function useAuditLogs() {
  const [filters, setFilters] = useState<AuditFilters>({
    search: '',
    action: 'ALL',
    role: 'ALL',
    module: 'ALL',
    dateRange: 'LAST_7_DAYS'
  });
  
  const [data, setData] = useState<PaginatedAuditLogs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 25;

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await auditService.getAuditLogs(filters, page, limit);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Unable to load audit logs.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const updateFilters = (newFilters: Partial<AuditFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset page on filter change
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      action: 'ALL',
      role: 'ALL',
      module: 'ALL',
      dateRange: 'LAST_7_DAYS'
    });
    setPage(1);
  };

  useAppEvent('refresh:audit', fetchLogs);

  return {
    data,
    isLoading,
    error,
    filters,
    updateFilters,
    clearFilters,
    page,
    setPage,
    refresh: fetchLogs
  };
}


