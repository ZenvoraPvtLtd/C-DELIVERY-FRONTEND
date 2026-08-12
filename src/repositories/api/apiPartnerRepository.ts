import { IPartnerRepository } from '../interfaces/IPartnerRepository';
import { DeliveryPartner, PartnerFilters, PaginatedResult, PartnerMutationPayload, PartnerStatus, PartnerAvailability } from '@/types/partner';
import { AuditActor } from '@/types/audit';
import { apiClient } from '@/lib/api/apiClient';
import { ApiListResponse, ApiResponse } from '@/lib/api/types';
import { PartnerDTO, CreatePartnerRequest, UpdatePartnerRequest } from '@/lib/api/dtos';
import { mapPartnerDtoToDomain, mapDomainToPartnerRequest } from '@/lib/api/mappers';

export const apiPartnerRepository: IPartnerRepository = {
  async getPartners(filters: PartnerFilters, page: number = 1, limit: number = 10): Promise<PaginatedResult<DeliveryPartner>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.availability && filters.availability !== 'ALL') params.append('availability', filters.availability);

    const response = await apiClient.get<ApiListResponse<PartnerDTO>>(`/delivery-partners?${params.toString()}`);
    
    return {
      data: response.data.map(mapPartnerDtoToDomain),
      total: response.meta.total,
      page: response.meta.page,
      limit: response.meta.pageSize,
      totalPages: response.meta.totalPages
    };
  },

  async getPartnerById(id: string): Promise<DeliveryPartner> {
    const response = await apiClient.get<ApiResponse<PartnerDTO>>(`/delivery-partners/${id}`);
    return mapPartnerDtoToDomain(response.data);
  },

  async createPartner(payload: PartnerMutationPayload, actor?: AuditActor | string): Promise<DeliveryPartner> {
    const requestData = mapDomainToPartnerRequest(payload);
    const response = await apiClient.post<ApiResponse<PartnerDTO>>(`/delivery-partners`, requestData);
    return mapPartnerDtoToDomain(response.data);
  },

  async updatePartner(id: string, payload: PartnerMutationPayload, actor?: AuditActor | string): Promise<DeliveryPartner> {
    const requestData = mapDomainToPartnerRequest(payload);
    const response = await apiClient.put<ApiResponse<PartnerDTO>>(`/delivery-partners/${id}`, requestData);
    return mapPartnerDtoToDomain(response.data);
  },

  async updatePartnerStatus(id: string, status: PartnerStatus, actor?: AuditActor | string): Promise<DeliveryPartner> {
    const response = await apiClient.patch<ApiResponse<PartnerDTO>>(`/delivery-partners/${id}/status`, { status });
    return mapPartnerDtoToDomain(response.data);
  },

  async updatePartnerAvailability(id: string, availability: PartnerAvailability): Promise<DeliveryPartner> {
    const response = await apiClient.patch<ApiResponse<PartnerDTO>>(`/delivery-partners/${id}/availability`, { availability });
    return mapPartnerDtoToDomain(response.data);
  }
};
