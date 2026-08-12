import { useState, useEffect, useCallback } from 'react';
import { DashboardFilters, DashboardSummary, DeliveryPipeline, DeliveryTrend, RecentDelivery, PartnerAvailability, DateRange } from '@/types/dashboard';
import { dashboardService } from '@/services/dashboard/dashboardService';
import { useAppEvent } from '@/lib/events';

export function useDashboard() {
  const [filters, setFilters] = useState<DashboardFilters>({ dateRange: 'today' });
  
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [pipeline, setPipeline] = useState<DeliveryPipeline[]>([]);
  const [trends, setTrends] = useState<DeliveryTrend[]>([]);
  const [recentDeliveries, setRecentDeliveries] = useState<RecentDelivery[]>([]);
  const [partnerAvailability, setPartnerAvailability] = useState<PartnerAvailability | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sum, pip, trd, rec, pa] = await Promise.all([
        dashboardService.getDashboardSummary(filters),
        dashboardService.getDeliveryPipeline(filters),
        dashboardService.getDeliveryTrends(filters),
        dashboardService.getRecentDeliveries(filters),
        dashboardService.getPartnerAvailability(filters)
      ]);
      
      setSummary(sum);
      setPipeline(pip);
      setTrends(trd);
      setRecentDeliveries(rec);
      setPartnerAvailability(pa);
    } catch (err) {
      setError('Something went wrong while loading delivery data.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const updateDateRange = (range: DateRange) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
  };

  const refresh = () => {
    fetchDashboardData();
  };

  useAppEvent('refresh:deliveries', fetchDashboardData);

  return {
    summary,
    pipeline,
    trends,
    recentDeliveries,
    partnerAvailability,
    isLoading,
    error,
    filters,
    updateDateRange,
    refresh
  };
}



