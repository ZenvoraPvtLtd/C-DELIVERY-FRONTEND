import { IPartnerRepository } from '../interfaces/IPartnerRepository';
import { DeliveryPartner, PartnerFilters, PaginatedResult, PartnerMutationPayload, PartnerStatus, PartnerAvailability } from '@/types/partner';
import { mockPartners } from '@/services/partners/partnerMockData';
import { auditService } from '@/services/audit/auditService';
import { AuditActor } from '@/types/audit';

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, 0));

export const mockPartnerRepository: IPartnerRepository = {
  async getPartners(filters: PartnerFilters, page: number = 1, limit: number = 10): Promise<PaginatedResult<DeliveryPartner>> {
    await delay(600);
    
    let filtered = [...mockPartners];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.partnerId.toLowerCase().includes(q) || 
        p.mobile.includes(q) || 
        (p.email && p.email.toLowerCase().includes(q))
      );
    }

    if (filters.status && filters.status !== 'ALL') {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    if (filters.availability && filters.availability !== 'ALL') {
      filtered = filtered.filter(p => p.availability === filters.availability);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedData = filtered.slice(start, start + limit);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages
    };
  },

  async getPartnerById(id: string): Promise<DeliveryPartner> {
    await delay(500);
    const partner = mockPartners.find(p => p.id === id);
    if (!partner) throw new Error('Partner not found');
    return partner;
  },

  async createPartner(payload: PartnerMutationPayload, actor?: AuditActor | string): Promise<DeliveryPartner> {
    await delay(800);
    
    // Validation simulation
    if (mockPartners.some(p => p.partnerId === payload.partnerId)) {
      throw new Error(`Partner ID ${payload.partnerId} already exists.`);
    }

    const newPartner: DeliveryPartner = {
      id: Math.random().toString(36).substring(7),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      todaysDeliveries: 0
    };

    mockPartners.unshift(newPartner);

    if (actor) {
      const actualActor = typeof actor === 'string' ? { userId: 'SYS', name: actor, role: 'SYSTEM' } : actor;
      auditService.createAuditEvent({
        actor: actualActor as any,
        action: 'UPDATE_PARTNER',
        module: 'DELIVERY_PARTNERS',
        recordId: newPartner.partnerId,
        newValue: { name: newPartner.name, status: newPartner.status }
      });
    }

    return newPartner;
  },

  async updatePartner(id: string, payload: PartnerMutationPayload, actor?: AuditActor | string): Promise<DeliveryPartner> {
    await delay(700);
    const index = mockPartners.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Partner not found');

    if (mockPartners[index].partnerId !== payload.partnerId && mockPartners.some(p => p.partnerId === payload.partnerId)) {
      throw new Error(`Partner ID ${payload.partnerId} already exists.`);
    }

    const oldPartner = mockPartners[index];
    const updated = {
      ...oldPartner,
      ...payload,
      updatedAt: new Date().toISOString()
    };
    
    mockPartners[index] = updated;

    if (actor) {
      const actualActor = typeof actor === 'string' ? { userId: 'SYS', name: actor, role: 'SYSTEM' } : actor;
      auditService.createAuditEvent({
        actor: actualActor as any,
        action: 'UPDATE_PARTNER',
        module: 'DELIVERY_PARTNERS',
        recordId: updated.partnerId,
        oldValue: { name: oldPartner.name, mobile: oldPartner.mobile },
        newValue: { name: updated.name, mobile: updated.mobile }
      });
    }

    return updated;
  },

  async updatePartnerStatus(id: string, status: PartnerStatus, actor?: AuditActor | string): Promise<DeliveryPartner> {
    await delay(500);
    const index = mockPartners.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Partner not found');
    
    const oldStatus = mockPartners[index].status;
    mockPartners[index].status = status;
    if (status === 'INACTIVE') {
      mockPartners[index].availability = 'INACTIVE';
    }
    mockPartners[index].updatedAt = new Date().toISOString();

    if (actor) {
      const actualActor = typeof actor === 'string' ? { userId: 'SYS', name: actor, role: 'SYSTEM' } : actor;
      auditService.createAuditEvent({
        actor: actualActor as any,
        action: 'UPDATE_PARTNER_STATUS',
        module: 'DELIVERY_PARTNERS',
        recordId: mockPartners[index].partnerId,
        oldValue: { status: oldStatus },
        newValue: { status }
      });
    }

    return mockPartners[index];
  },

  async updatePartnerAvailability(id: string, availability: PartnerAvailability): Promise<DeliveryPartner> {
    await delay(500);
    const index = mockPartners.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Partner not found');
    
    if (mockPartners[index].status === 'INACTIVE' && availability !== 'INACTIVE') {
      throw new Error('Cannot change availability of an inactive partner.');
    }
    
    mockPartners[index].availability = availability;
    mockPartners[index].updatedAt = new Date().toISOString();
    return mockPartners[index];
  }
};

