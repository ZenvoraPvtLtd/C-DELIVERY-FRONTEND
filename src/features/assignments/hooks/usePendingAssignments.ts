import { useState, useEffect, useCallback, useRef } from 'react';
import { DeliveryOrder, PaginatedDeliveries } from '@/types/delivery';
import { AssignmentFilters } from '@/types/assignment';
import { assignmentService } from '@/services/assignments/assignmentService';
import { useAppEvent } from '@/lib/events';

export function usePendingAssignments() {
  const [filters, setFilters] = useState<AssignmentFilters>({ search: '', priority: 'ALL' });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  const [data, setData] = useState<PaginatedDeliveries | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdRef = useRef(0);

  const fetchAssignments = useCallback(async () => {
    const fetchId = ++fetchIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const result = await assignmentService.getPendingAssignments(filters, page, limit);
      if (fetchId === fetchIdRef.current) {
        setData(result);
      }
    } catch (err) {
      if (fetchId === fetchIdRef.current) {
        setError('Unable to load pending assignments.');
      }
    } finally {
      if (fetchId === fetchIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [filters, page, limit]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const updateFilters = (newFilters: Partial<AssignmentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ search: '', priority: 'ALL' });
    setPage(1);
  };

return {
    data,
    isLoading,
    error,
    filters,
    updateFilters,
    clearFilters,
    page,
    setPage,
    refresh: fetchAssignments
  };
}


