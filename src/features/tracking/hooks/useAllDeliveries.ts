import { useState, useEffect, useCallback, useRef } from 'react';
import { DeliveryOrder, PaginatedDeliveries } from '@/types/delivery';
import { DeliveryFilters } from '@/types/tracking';
import { deliveryService } from '@/services/deliveries/deliveryService';
import { useAppEvent } from '@/lib/events';

export function useAllDeliveries() {
  const [filters, setFilters] = useState<DeliveryFilters>({ search: '', status: 'ALL', partnerId: 'ALL', dateRange: 'ALL' });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const [data, setData] = useState<PaginatedDeliveries | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdRef = useRef(0);

  const fetchDeliveries = useCallback(async () => {
    const fetchId = ++fetchIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const result = await deliveryService.getAllDeliveries(filters, page, limit);
      if (fetchId === fetchIdRef.current) {
        setData(result);
      }
    } catch (err: any) {
      if (fetchId === fetchIdRef.current) {
        setError(err.message || 'Unable to load deliveries.');
      }
    } finally {
      if (fetchId === fetchIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [filters, page, limit]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const updateFilters = (newFilters: Partial<DeliveryFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ search: '', status: 'ALL', partnerId: 'ALL', dateRange: 'ALL' });
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
    limit,
    setLimit,
    refresh: fetchDeliveries
  };
}


