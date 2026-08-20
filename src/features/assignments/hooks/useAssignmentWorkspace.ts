import { useState, useEffect, useCallback } from 'react';
import { assignmentService } from '@/services/assignments/assignmentService';
import { AssignmentWorkspaceFilters, AssignmentMetrics } from '@/types/assignment';
import { PaginatedDeliveries } from '@/types/delivery';
import { appEvents } from '@/lib/events';

// Global cache to store data across component mounts for instant UI transitions
const globalCache = new Map<string, { data: PaginatedDeliveries, metrics: AssignmentMetrics }>();

// Pre-warms the cache silently in the background
export function prefetchAssignments() {
  const filters = { search: '', status: 'ALL', partnerId: 'ALL', dateRange: 'ALL' };
  const page = 1;
  const limit = 10;
  const cacheKey = JSON.stringify({ filters, page, limit });
  if (!globalCache.has(cacheKey)) {
    Promise.all([
      assignmentService.getAllAssignments(filters as any, page, limit),
      assignmentService.getAssignmentMetrics()
    ]).then(([data, metrics]) => {
      globalCache.set(cacheKey, { data, metrics });
    }).catch(() => {});
  }
}

export function useAssignmentWorkspace() {
  const [filters, setFilters] = useState<AssignmentWorkspaceFilters>({
    search: '',
    status: 'ALL',
    partnerId: 'ALL',
    dateRange: 'ALL'
  });
  
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const cacheKey = JSON.stringify({ filters, page, limit });
  const cached = globalCache.get(cacheKey);

  const [data, setData] = useState<PaginatedDeliveries | null>(cached?.data || null);
  const [metrics, setMetrics] = useState<AssignmentMetrics | null>(cached?.metrics || null);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!globalCache.has(cacheKey) || isRefresh) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const [assignmentsData, metricsData] = await Promise.all([
        assignmentService.getAllAssignments(filters, page, limit),
        assignmentService.getAssignmentMetrics()
      ]);
      globalCache.set(cacheKey, { data: assignmentsData, metrics: metricsData });
      setData(assignmentsData);
      setMetrics(metricsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch assignments data');
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, cacheKey]);

  useEffect(() => {
    // We intentionally call this on mount even if cached to background revalidate
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
