import { useState, useEffect, useCallback } from 'react';
import { assignmentService } from '@/services/assignments/assignmentService';
import { AssignmentWorkspaceFilters, AssignmentMetrics } from '@/types/assignment';
import { PaginatedDeliveries } from '@/types/delivery';
import { appEvents } from '@/lib/events';

export function useAssignmentWorkspace() {
  const [data, setData] = useState<PaginatedDeliveries | null>(null);
  const [metrics, setMetrics] = useState<AssignmentMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<AssignmentWorkspaceFilters>({
    search: '',
    status: 'ALL',
    partnerId: 'ALL',
    dateRange: 'ALL'
  });
  
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [assignmentsData, metricsData] = await Promise.all([
        assignmentService.getAllAssignments(filters, page, limit),
        assignmentService.getAssignmentMetrics()
      ]);
      setData(assignmentsData);
      setMetrics(metricsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch assignments data');
    } finally {
      setIsLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleRefresh = () => fetchData();
    const unsubAssignments = appEvents.on('refresh:assignments', handleRefresh);
    const unsubDeliveries = appEvents.on('refresh:deliveries', handleRefresh);
    return () => {
      unsubAssignments();
      unsubDeliveries();
    };
  }, [fetchData]);

  const updateFilters = (newFilters: Partial<AssignmentWorkspaceFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'ALL',
      partnerId: 'ALL',
      dateRange: 'ALL'
    });
    setPage(1);
  };

  return {
    data,
    metrics,
    isLoading,
    error,
    filters,
    updateFilters,
    clearFilters,
    page,
    setPage,
    refresh: fetchData
  };
}
