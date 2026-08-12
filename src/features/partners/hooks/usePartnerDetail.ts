import { useState, useEffect, useCallback } from 'react';
import { DeliveryPartner } from '@/types/partner';
import { partnerService } from '@/services/partners/partnerService';
import { useAppEvent } from '@/lib/events';

export function usePartnerDetail(id: string) {
  const [partner, setPartner] = useState<DeliveryPartner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartner = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await partnerService.getPartnerById(id);
      setPartner(data);
    } catch (err) {
      setError('Unable to load partner details.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPartner();
  }, [fetchPartner]);

  useAppEvent('refresh:partners', fetchPartner);

  return {
    partner,
    isLoading,
    error,
    refresh: fetchPartner
  };
}


