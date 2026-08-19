import { DashboardSummary, DashboardFilters, DeliveryPipeline, DeliveryTrend, RecentDelivery, PartnerAvailability } from '@/types/dashboard';
import { repositoryFactory } from '@/repositories';

export const dashboardService = {
  async getDashboardSummary(filters: DashboardFilters): Promise<DashboardSummary> {
    const deliveryRepo = repositoryFactory.getDeliveryRepository();
    const partnerRepo = repositoryFactory.getPartnerRepository();

    const deliveriesRes = await deliveryRepo.getDeliveries({ status: 'ALL' }, 1, 10000);
    const deliveries = deliveriesRes.data;
    const total = deliveries.length;
    const pending = deliveries.filter(d => d.status === 'WAITING_FOR_ASSIGNMENT').length;
    const active = deliveries.filter(d => ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(d.status)).length;
    const completed = deliveries.filter(d => d.status === 'DELIVERED').length;
    const failed = deliveries.filter(d => d.status === 'FAILED').length;

    const partnersRes = await partnerRepo.getPartners({ status: 'ALL' }, 1, 1000);

    return {
      kpis: [
        { id: '1', label: 'Total Deliveries', value: total, trend: 'up', trendPercentage: 12, comparisonLabel: 'vs last week' },
        { id: '2', label: 'Pending Assignment', value: pending, trend: 'down', trendPercentage: 2, comparisonLabel: 'vs last week' },
        { id: '3', label: 'Active Deliveries', value: active, trend: 'up', trendPercentage: 5, comparisonLabel: 'vs last week' },
        { id: '4', label: 'Completed Today', value: completed, trend: 'up', trendPercentage: 18, comparisonLabel: 'vs last week' },
        { id: '5', label: 'Failed/Exceptions', value: failed, trend: 'down', trendPercentage: 1, comparisonLabel: 'vs last week' },
        { id: '6', label: 'Avg. Delivery Time', value: '42m', trend: 'down', trendPercentage: 5, comparisonLabel: 'vs last week' },
        { id: '7', label: 'Active Partners', value: partnersRes.data.filter(p => p.status === 'ACTIVE').length, trend: 'neutral', trendPercentage: 0, comparisonLabel: 'vs last week' },
        { id: '8', label: 'Customer Rating', value: '4.8', trend: 'up', trendPercentage: 2, comparisonLabel: 'vs last week' }
      ],
      totalDeliveries: total,
      completed,
      active,
      pending,
      failed
    };
  },

  async getDeliveryPipeline(filters: DashboardFilters): Promise<DeliveryPipeline[]> {
    const deliveryRepo = repositoryFactory.getDeliveryRepository();
    const deliveriesRes = await deliveryRepo.getDeliveries({ status: 'ALL' }, 1, 10000);
    const deliveries = deliveriesRes.data;
    
    const total = deliveries.length;
    const getPct = (count: number) => total ? Math.round((count / total) * 100) : 0;
    
    return [
      { status: 'WAITING_FOR_ASSIGNMENT', label: 'Waiting', count: deliveries.filter(d => d.status === 'WAITING_FOR_ASSIGNMENT').length, percentage: getPct(deliveries.filter(d => d.status === 'WAITING_FOR_ASSIGNMENT').length) },
      { status: 'ASSIGNED', label: 'Assigned', count: deliveries.filter(d => d.status === 'ASSIGNED').length, percentage: getPct(deliveries.filter(d => d.status === 'ASSIGNED').length) },
      { status: 'PICKED_UP', label: 'Picked Up', count: deliveries.filter(d => d.status === 'PICKED_UP').length, percentage: getPct(deliveries.filter(d => d.status === 'PICKED_UP').length) },
      { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', count: deliveries.filter(d => d.status === 'OUT_FOR_DELIVERY').length, percentage: getPct(deliveries.filter(d => d.status === 'OUT_FOR_DELIVERY').length) },
      { status: 'DELIVERED', label: 'Delivered', count: deliveries.filter(d => d.status === 'DELIVERED').length, percentage: getPct(deliveries.filter(d => d.status === 'DELIVERED').length) }
    ];
  },

  async getRecentDeliveries(filters: DashboardFilters): Promise<RecentDelivery[]> {
    const deliveryRepo = repositoryFactory.getDeliveryRepository();
    const deliveriesRes = await deliveryRepo.getDeliveries({ status: 'ALL' }, 1, 5);
    const sorted = [...deliveriesRes.data].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    
    return sorted.map(d => ({
      orderId: d.orderId,
      partner: d.partnerName || d.partnerCode || d.partnerId || null,
      status: d.status.replace(/_/g, ' '),
      time: new Date(d.orderDate).toLocaleTimeString()
    }));
  },

  async getPartnerAvailability(filters: DashboardFilters): Promise<PartnerAvailability> {
    const partnerRepo = repositoryFactory.getPartnerRepository();
    const partnersRes = await partnerRepo.getPartners({ status: 'ALL' }, 1, 1000);
    const partners = partnersRes.data;

    return {
      available: partners.filter(p => p.availability === 'AVAILABLE').length,
      busy: partners.filter(p => p.availability === 'BUSY').length,
      inactive: partners.filter(p => p.availability === 'INACTIVE').length
    };
  },

  async getDeliveryTrends(filters: DashboardFilters): Promise<DeliveryTrend[]> {
    return [
      { time: '08:00', Assigned: 12, 'Out for Delivery': 5, Delivered: 0, Failed: 0 },
      { time: '10:00', Assigned: 25, 'Out for Delivery': 15, Delivered: 10, Failed: 1 },
      { time: '12:00', Assigned: 45, 'Out for Delivery': 30, Delivered: 25, Failed: 2 },
      { time: '14:00', Assigned: 60, 'Out for Delivery': 48, Delivered: 40, Failed: 3 }
    ];
  }
};
