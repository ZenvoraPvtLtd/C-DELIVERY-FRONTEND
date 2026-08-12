import { DeliveryPartner, PartnerFilters, PaginatedResult, PartnerMutationPayload, PartnerStatus, PartnerAvailability } from '@/types/partner';
import { appEvents } from '@/lib/events';
import { repositoryFactory } from '@/repositories';
import { AuditActor } from '@/types/audit';

export const partnerService = {
  async getPartners(filters: PartnerFilters, page: number = 1, limit: number = 10): Promise<PaginatedResult<DeliveryPartner>> {
    const repo = repositoryFactory.getPartnerRepository();
    return repo.getPartners(filters, page, limit);
  },

  async getPartnerById(id: string): Promise<DeliveryPartner> {
    const repo = repositoryFactory.getPartnerRepository();
    return repo.getPartnerById(id);
  },

  async createPartner(payload: PartnerMutationPayload, actor: AuditActor | string = 'Current User'): Promise<DeliveryPartner> {
    const repo = repositoryFactory.getPartnerRepository();
    const result = await repo.createPartner(payload, actor);
    appEvents.emit('refresh:partners');
    appEvents.emit('refresh:audit');
    return result;
  },

  async updatePartner(id: string, payload: PartnerMutationPayload, actor: AuditActor | string = 'Current User'): Promise<DeliveryPartner> {
    const repo = repositoryFactory.getPartnerRepository();
    const result = await repo.updatePartner(id, payload, actor);
    appEvents.emit('refresh:partners');
    appEvents.emit('refresh:audit');
    return result;
  },

  async updatePartnerStatus(id: string, status: PartnerStatus, actor: AuditActor | string = 'Current User'): Promise<DeliveryPartner> {
    const repo = repositoryFactory.getPartnerRepository();
    const result = await repo.updatePartnerStatus(id, status, actor);
    appEvents.emit('refresh:partners');
    appEvents.emit('refresh:audit');
    return result;
  },

  async updatePartnerAvailability(id: string, availability: PartnerAvailability): Promise<DeliveryPartner> {
    const repo = repositoryFactory.getPartnerRepository();
    const result = await repo.updatePartnerAvailability(id, availability);
    appEvents.emit('refresh:partners');
    appEvents.emit('refresh:audit');
    return result;
  }
};
