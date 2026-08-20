import { IReportRepository } from '../interfaces/IReportRepository';
import { DeliveryReportFilters } from '@/types/reports';
import { DeliveryOrder } from '@/types/delivery';
import { mockDeliveries } from '@/services/deliveries/deliveryMockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, 0));

export const mockReportRepository: IReportRepository = {
  async getReportData(filters: DeliveryReportFilters): Promise<DeliveryOrder[]> {
    
    
    let filtered = [...mockDeliveries];

    if (filters.partnerId && filters.partnerId !== 'ALL') {
      filtered = filtered.filter(d => d.partnerId === filters.partnerId);
    }

    if (filters.status && filters.status !== 'ALL') {
      filtered = filtered.filter(d => d.status === filters.status);
    }

    if (filters.dateRange && filters.dateRange !== 'ALL') {
      const now = new Date();
      let cutoff = new Date();
      
      switch (filters.dateRange) {
        case 'TODAY':
          cutoff.setHours(0,0,0,0);
          break;
        case 'YESTERDAY':
          cutoff.setDate(cutoff.getDate() - 1);
          cutoff.setHours(0,0,0,0);
          break;
        case 'LAST_7_DAYS':
          cutoff.setDate(cutoff.getDate() - 7);
          break;
        case 'LAST_30_DAYS':
          cutoff.setDate(cutoff.getDate() - 30);
          break;
      }
      
      filtered = filtered.filter(d => {
        const logDate = new Date(d.orderDate);
        if (filters.dateRange === 'YESTERDAY') {
          const endOfYesterday = new Date(cutoff);
          endOfYesterday.setHours(23, 59, 59, 999);
          return logDate >= cutoff && logDate <= endOfYesterday;
        }
        return logDate >= cutoff;
      });
    }

    return filtered;
  }
};

