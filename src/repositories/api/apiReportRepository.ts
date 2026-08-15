import { IReportRepository } from '../interfaces/IReportRepository';
import { DeliveryReportFilters } from '@/types/reports';
import { DeliveryOrder } from '@/types/delivery';
import { apiClient } from '@/lib/api/apiClient';
import { ApiListResponse } from '@/lib/api/types';
import { DeliveryDTO } from '@/lib/api/dtos';
import { mapDeliveryDtoToDomain } from '@/lib/api/mappers';

export const apiReportRepository: IReportRepository = {
  async getReportData(filters: DeliveryReportFilters): Promise<DeliveryOrder[]> {
    const params = new URLSearchParams();
    
    if (filters.partnerId && filters.partnerId !== 'ALL') params.append('partnerId', filters.partnerId);
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.dateRange && filters.dateRange !== 'ALL') params.append('dateRange', filters.dateRange);

    const response = await apiClient.get<ApiListResponse<DeliveryDTO>>(`/reports/deliveries?${params.toString()}`);
    
    return response.data.map(d => mapDeliveryDtoToDomain(d));
  },

  async getAggregatedReportData(filters: DeliveryReportFilters): Promise<any> {
    const params = new URLSearchParams();
    
    if (filters.partnerId && filters.partnerId !== 'ALL') params.append('partnerId', filters.partnerId);
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.dateRange && filters.dateRange !== 'ALL') params.append('dateRange', filters.dateRange);

    const response = await apiClient.get<any>(`/reports/overview?${params.toString()}`);
    return response.data;
  }
};
