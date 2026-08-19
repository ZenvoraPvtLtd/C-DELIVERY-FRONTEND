import { IDeliveryRepository } from '../interfaces/IDeliveryRepository';
import { DeliveryOrder, DeliveryStatus, PaginatedDeliveries } from '@/types/delivery';
import { AuditActor } from '@/types/audit';
import { apiClient } from '@/lib/api/apiClient';
import { ApiListResponse, ApiResponse } from '@/lib/api/types';
import { DeliveryDTO, TimelineDTO, AssignmentHistoryDTO, UpdateDeliveryStatusRequest } from '@/lib/api/dtos';
import { mapDeliveryDtoToDomain } from '@/lib/api/mappers';

export const apiDeliveryRepository: IDeliveryRepository = {
  async getDeliveries(filters: any, page: number = 1, limit: number = 10): Promise<PaginatedDeliveries> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.partnerId && filters.partnerId !== 'ALL') params.append('partner_id', filters.partnerId);

    const response = await apiClient.get<ApiListResponse<DeliveryDTO>>(`/deliveries?${params.toString()}`);
    
    return {
      data: response.data.map(d => mapDeliveryDtoToDomain(d)),
      total: response.meta.total,
      page: response.meta.page,
      limit: response.meta.pageSize,
      totalPages: response.meta.totalPages
    };
  },

  async getDeliveryHistory(filters: any, page: number = 1, limit: number = 10): Promise<PaginatedDeliveries> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      history: 'true'
    });
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);

    const response = await apiClient.get<ApiListResponse<DeliveryDTO>>(`/deliveries/history?${params.toString()}`);
    
    return {
      data: response.data.map(d => mapDeliveryDtoToDomain(d)),
      total: response.meta.total,
      page: response.meta.page,
      limit: response.meta.pageSize,
      totalPages: response.meta.totalPages
    };
  },

  async getDeliveryById(orderId: string): Promise<DeliveryOrder> {
    const response = await apiClient.get<ApiResponse<{
      delivery: DeliveryDTO,
      timeline: TimelineDTO[],
      assignments: AssignmentHistoryDTO[]
    }>>(`/orders/${orderId}/delivery`);
    
    return mapDeliveryDtoToDomain(response.data.delivery, response.data.timeline, response.data.assignments);
  },

  async updateDeliveryStatus(orderId: string, newStatus: DeliveryStatus, actor: AuditActor | string, failureReason?: string): Promise<DeliveryOrder> {
    const requestData: UpdateDeliveryStatusRequest = {
      status: newStatus,
      failure_reason: failureReason,
      actor
    };
    
    const response = await apiClient.patch<ApiResponse<{
      delivery: DeliveryDTO,
      timeline: TimelineDTO[],
      assignments: AssignmentHistoryDTO[]
    }>>(`/orders/${orderId}/delivery/status`, requestData);
    
    return mapDeliveryDtoToDomain(response.data.delivery, response.data.timeline, response.data.assignments);
  }
};
