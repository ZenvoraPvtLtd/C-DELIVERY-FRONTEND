import { reportRepository } from '../repositories/report.repository';

export class ReportService {
  async getOverview(filters: any) {
    let granularity: 'hourly' | 'daily' = 'daily';
    if (filters.dateRange === 'TODAY' || filters.dateRange === 'YESTERDAY') {
      granularity = 'hourly';
    }

    const [
      kpis,
      statusDistribution,
      trend,
      partnerPerformance,
      timeAnalytics,
      summary
    ] = await Promise.all([
      reportRepository.getKPIs(filters),
      reportRepository.getStatusDistribution(filters),
      reportRepository.getDeliveryTrend(filters, granularity),
      reportRepository.getPartnerPerformance(filters),
      reportRepository.getTimeAnalytics(filters),
      reportRepository.getDeliverySummary(filters)
    ]);

    return {
      kpis,
      statusDistribution,
      trend,
      partnerPerformance,
      timeAnalytics,
      summary
    };
  }
}

export const reportService = new ReportService();
