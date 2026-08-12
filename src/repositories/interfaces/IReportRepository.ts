import { DeliveryReportFilters } from '@/types/reports';
import { DeliveryOrder } from '@/types/delivery';

export interface IReportRepository {
  getReportData(filters: DeliveryReportFilters): Promise<DeliveryOrder[]>;
}
