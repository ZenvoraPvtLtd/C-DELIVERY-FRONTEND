import { DeliveryOrder } from '@/types/delivery';
import { DeliveryReportFilters } from '@/types/reports';
import { repositoryFactory } from '@/repositories';
import { calculateDeliveryKPIs, calculateStatusDistribution, calculateDeliveryTrend, calculatePartnerPerformance, calculateTimeAnalytics, calculateDeliverySummary } from '@/lib/delivery/reportCalculations';

export const reportService = {
  async getDeliveryReportData(filters: DeliveryReportFilters) {
    const reportRepo = repositoryFactory.getReportRepository();
    const partnerRepo = repositoryFactory.getPartnerRepository();

    if (reportRepo.getAggregatedReportData) {
      return await reportRepo.getAggregatedReportData(filters);
    }

    const filteredDeliveries = await reportRepo.getReportData(filters);
    
    // Partner filters for calculations
    const allPartnersResult = await partnerRepo.getPartners({ search: '', status: 'ALL', availability: 'ALL' }, 1, 1000);
    const partners = allPartnersResult.data;

    let granularity: 'hourly' | 'daily' = 'daily';
    if (filters.dateRange === 'TODAY' || filters.dateRange === 'YESTERDAY') {
      granularity = 'hourly';
    }

    return {
      raw: filteredDeliveries,
      kpis: calculateDeliveryKPIs(filteredDeliveries, partners),
      statusDistribution: calculateStatusDistribution(filteredDeliveries),
      trend: calculateDeliveryTrend(filteredDeliveries, granularity),
      partnerPerformance: calculatePartnerPerformance(filteredDeliveries, partners),
      timeAnalytics: calculateTimeAnalytics(filteredDeliveries),
      summary: calculateDeliverySummary(filteredDeliveries)
    };
  }
};
