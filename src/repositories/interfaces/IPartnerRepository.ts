import { DeliveryPartner, PartnerFilters, PaginatedResult, PartnerMutationPayload, PartnerStatus, PartnerAvailability } from '@/types/partner';
import { AuditActor } from '@/types/audit';

export interface IPartnerRepository {
  getPartners(filters: PartnerFilters, page?: number, limit?: number): Promise<PaginatedResult<DeliveryPartner>>;
  getPartnerById(id: string): Promise<DeliveryPartner>;
  createPartner(payload: PartnerMutationPayload, actor?: AuditActor | string): Promise<DeliveryPartner>;
  updatePartner(id: string, payload: PartnerMutationPayload, actor?: AuditActor | string): Promise<DeliveryPartner>;
  updatePartnerStatus(id: string, status: PartnerStatus, actor?: AuditActor | string): Promise<DeliveryPartner>;
  updatePartnerAvailability(id: string, availability: PartnerAvailability): Promise<DeliveryPartner>;
}
