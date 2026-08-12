import { useState, useEffect, useCallback, useRef } from 'react';
import { DeliveryPartner, PartnerFilters, PaginatedResult } from '@/types/partner';
import { partnerService } from '@/services/partners/partnerService';
import { useAppEvent } from '@/lib/events';

export function usePartners() {
  const [filters, setFilters] = useState<PartnerFilters>({ search: '', status: 'ALL', availability: 'ALL' });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  const [data, setData] = useState<PaginatedResult<DeliveryPartner> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdRef = useRef(0);

  const fetchPartners = useCallback(async () => {
    const fetchId = ++fetchIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const result = await partnerService.getPartners(filters, page, limit);
      if (fetchId === fetchIdRef.current) {
        setData(result);
      }
    } catch (err) {
      if (fetchId === fetchIdRef.current) {
        setError('Unable to load delivery partners. Something went wrong.');
      }
    } finally {
      if (fetchId === fetchIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [filters, page, limit]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const updateFilters = (newFilters: Partial<PartnerFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to page 1 on filter change
  };

  const clearFilters = () => {
    setFilters({ search: '', status: 'ALL', availability: 'ALL' });
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
    refresh: fetchPartners
  };
}


