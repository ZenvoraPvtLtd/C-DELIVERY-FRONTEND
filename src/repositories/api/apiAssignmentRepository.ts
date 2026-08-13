import { IAssignmentRepository } from '../interfaces/IAssignmentRepository';
import { DeliveryOrder, PaginatedDeliveries } from '@/types/delivery';
import { AssignmentFilters, AssignmentValidationResult, AssignmentWorkspaceFilters, AssignmentMetrics } from '@/types/assignment';
import { DeliveryPartner } from '@/types/partner';
import { AuditActor } from '@/types/audit';
import { apiClient } from '@/lib/api/apiClient';
import { ApiListResponse, ApiResponse } from '@/lib/api/types';
import { DeliveryDTO, TimelineDTO, AssignmentHistoryDTO, PartnerDTO, AssignDeliveryRequest, ReassignDeliveryRequest } from '@/lib/api/dtos';
import { mapDeliveryDtoToDomain, mapPartnerDtoToDomain } from '@/lib/api/mappers';

export const apiAssignmentRepository: IAssignmentRepository = {
  async getAllAssignments(filters: AssignmentWorkspaceFilters, page: number = 1, limit: number = 10): Promise<PaginatedDeliveries> {
    throw new Error('Not implemented for API yet');
  },

  async getAssignmentMetrics(): Promise<AssignmentMetrics> {
    throw new Error('Not implemented for API yet');
  },
  async getPendingAssignments(filters: AssignmentFilters, page: number = 1, limit: number = 10): Promise<PaginatedDeliveries> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status: 'WAITING_FOR_ASSIGNMENT'
    });
    
    if (filters.search) params.append('search', filters.search);
    if (filters.priority && filters.priority !== 'ALL') params.append('priority', filters.priority);

    const response = await apiClient.get<ApiListResponse<DeliveryDTO>>(`/deliveries?${params.toString()}`);
    
    return {
      data: response.data.map(d => mapDeliveryDtoToDomain(d)),
      total: response.meta.total,
      page: response.meta.page,
      limit: response.meta.pageSize,
      totalPages: response.meta.totalPages
    };
  },

  async getPartnersForAssignment(search?: string): Promise<{ partner: DeliveryPartner; isEligible: boolean; reason?: string }[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);

    const response = await apiClient.get<ApiResponse<{ partner: PartnerDTO; isEligible: boolean; reason?: string }[]>>(`/delivery/assignments/eligible-partners?${params.toString()}`);
    
    return response.data.map(item => ({
      partner: mapPartnerDtoToDomain(item.partner),
      isEligible: item.isEligible,
      reason: item.reason
    }));
  },

  async validateAssignment(orderId: string, partnerId: string): Promise<AssignmentValidationResult> {
    const response = await apiClient.post<ApiResponse<AssignmentValidationResult>>(`/delivery/assignments/validate`, {
      orderId,
      partnerId
    });
    return response.data;
  },

  async assignPartner(orderId: string, partnerId: string, actor?: AuditActor | string): Promise<DeliveryOrder> {
    const requestData: AssignDeliveryRequest = {
      partner_id: partnerId,
      actor
    };
    
    const response = await apiClient.post<ApiResponse<{
      delivery: DeliveryDTO,
      timeline: TimelineDTO[],
      assignments: AssignmentHistoryDTO[]
    }>>(`/orders/${orderId}/assignments`, requestData);
    
    return mapDeliveryDtoToDomain(response.data.delivery, response.data.timeline, response.data.assignments);
  },

  async getEligibleReassignmentPartners(orderId: string, search?: string): Promise<{ partner: DeliveryPartner; isEligible: boolean; reason?: string }[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);

    const response = await apiClient.get<ApiResponse<{ partner: PartnerDTO; isEligible: boolean; reason?: string }[]>>(`/orders/${orderId}/assignments/eligible-partners?${params.toString()}`);
    
    return response.data.map(item => ({
      partner: mapPartnerDtoToDomain(item.partner),
      isEligible: item.isEligible,
      reason: item.reason
    }));
  },

  async reassignDelivery(orderId: string, newPartnerId: string, reason: string, notes?: string, actor?: AuditActor | string): Promise<DeliveryOrder> {
    const requestData: ReassignDeliveryRequest = {
      new_partner_id: newPartnerId,
      reason,
      notes,
      actor
    };
    
    const response = await apiClient.post<ApiResponse<{
      delivery: DeliveryDTO,
      timeline: TimelineDTO[],
      assignments: AssignmentHistoryDTO[]
    }>>(`/orders/${orderId}/assignments/reassign`, requestData);
    
    return mapDeliveryDtoToDomain(response.data.delivery, response.data.timeline, response.data.assignments);
  }
};

