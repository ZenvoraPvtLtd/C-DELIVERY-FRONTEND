import { useState, useEffect, useCallback, useRef } from 'react';
import { DeliveryReportFilters } from '@/types/reports';
import { reportService } from '@/services/deliveries/reportService';
import { useAppEvent } from '@/lib/events';

export function useDeliveryReports() {
  const [filters, setFilters] = useState<DeliveryReportFilters>({ search: '', status: 'ALL', partnerId: 'ALL', dateRange: 'TODAY' });
  
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdRef = useRef(0);

  const fetchReport = useCallback(async () => {
    const fetchId = ++fetchIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const result = await reportService.getDeliveryReportData(filters);
      if (fetchId === fetchIdRef.current) {
        setData(result);
      }
    } catch (err: any) {
      if (fetchId === fetchIdRef.current) {
        setError(err.message || 'Unable to load delivery reports.');
      }
    } finally {
      if (fetchId === fetchIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [filters]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const updateFilters = (newFilters: Partial<DeliveryReportFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({ search: '', status: 'ALL', partnerId: 'ALL', dateRange: 'TODAY' });
  };

return {
    data,
    isLoading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refresh: fetchReport
  };
}


