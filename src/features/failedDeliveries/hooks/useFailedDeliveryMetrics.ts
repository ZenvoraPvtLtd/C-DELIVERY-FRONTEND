import { useState, useEffect, useCallback, useRef } from 'react';
import { FailedDeliveryMetrics } from '@/types/tracking';
import { failedDeliveryService } from '@/services/deliveries/failedDeliveryService';

export function useFailedDeliveryMetrics() {
  const [metrics, setMetrics] = useState<FailedDeliveryMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchIdRef = useRef(0);

  const fetchMetrics = useCallback(async () => {
    const fetchId = ++fetchIdRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const result = await failedDeliveryService.getFailedMetrics();
      if (fetchId === fetchIdRef.current) {
        setMetrics(result);
      }
    } catch (err: any) {
      if (fetchId === fetchIdRef.current) {
        setError(err.message || 'Unable to load metrics.');
      }
    } finally {
      if (fetchId === fetchIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    isLoading,
    error,
    refresh: fetchMetrics
  };
}
