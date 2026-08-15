import { partnerRepository } from '../repositories/partner.repository';
import { mapPartnerToDTO } from '../utils/partner.mapper';
import { NotFoundError, ConflictError, ValidationError } from '../utils/errors';
import { PartnerStatus, PartnerAvailability } from '../constants/partnerStatus';
import { IDeliveryPartner } from '../models/DeliveryPartner.model';
import { auditLogService } from '../services/auditLog.service';

export class PartnerService {
  private async checkDuplicates(mobile: string, email?: string, excludeId?: string) {
    const existingMobile = await partnerRepository.findByMobile(mobile, excludeId);
    if (existingMobile) {
      throw new ConflictError('A partner with this mobile number already exists');
    }

    if (email) {
      const existingEmail = await partnerRepository.findByEmail(email, excludeId);
      if (existingEmail) {
        throw new ConflictError('A partner with this email address already exists');
      }
    }
  }

  async getPartners(filters: any, page: number, limit: number) {
    const result = await partnerRepository.getPartners(filters, page, limit);
    
    // We fetch today's deliveries in parallel for all partners in the current page
    const dataWithWorkloads = await Promise.all(
      result.data.map(async (partner) => {
        const todaysDeliveries = await partnerRepository.countTodaysDeliveries(partner._id?.toString() || '');
        return mapPartnerToDTO(partner, todaysDeliveries);
      })
    );

    return {
      data: dataWithWorkloads,
      meta: result.meta
    };
  }

  async getPartnerById(id: string) {
    const partner = await partnerRepository.findById(id);
    if (!partner) {
      throw new NotFoundError('Delivery Partner not found');
    }
    const todaysDeliveries = await partnerRepository.countTodaysDeliveries(partner._id?.toString() || '');
    return mapPartnerToDTO(partner, todaysDeliveries);
  }

  async createPartner(data: Partial<IDeliveryPartner>, actor: any) {
    if (!data.name || !data.mobile || !data.partnerId) {
      throw new ValidationError('Name, mobile, and partner ID are required');
    }

    const existingId = await partnerRepository.findByPartnerCode(data.partnerId);
    if (existingId) {
      throw new ConflictError('A partner with this Partner ID already exists');
    }

    await this.checkDuplicates(data.mobile, data.email);

    const partner = await partnerRepository.create(data);

    const actorId = actor?.userId || 'Unknown';
    const actorName = actor?.name || 'Unknown';
    const actorRole = actor?.role || 'SYSTEM';

    await auditLogService.createAuditLog({
      actor: { userId: actorId, name: actorName, role: actorRole },
      action: 'UPDATE_PARTNER',
      module: 'DELIVERY_PARTNERS',
      recordId: partner._id?.toString(),
      oldValue: null,
      newValue: { ...data },
      reason: 'Partner Created'
    });

    return mapPartnerToDTO(partner, 0);
  }

  async updatePartner(id: string, data: Partial<IDeliveryPartner>, actor: any) {
    const partner = await partnerRepository.findById(id);
    if (!partner) {
      throw new NotFoundError('Delivery Partner not found');
    }

    if (data.mobile) {
      await this.checkDuplicates(data.mobile, data.email, id);
    }

    // We do not allow changing partnerId (partner_code) in updates
    delete data.partnerId;

    const updatedPartner = await partnerRepository.update(id, data);
    if (!updatedPartner) {
      throw new NotFoundError('Failed to update Delivery Partner');
    }

    const actorId = actor?.userId || 'Unknown';
    const actorName = actor?.name || 'Unknown';
    const actorRole = actor?.role || 'SYSTEM';

    await auditLogService.createAuditLog({
      actor: { userId: actorId, name: actorName, role: actorRole },
      action: 'UPDATE_PARTNER',
      module: 'DELIVERY_PARTNERS',
      recordId: updatedPartner._id?.toString(),
      oldValue: partner,
      newValue: data,
      reason: 'Partner Updated'
    });

    const todaysDeliveries = await partnerRepository.countTodaysDeliveries(id);
    return mapPartnerToDTO(updatedPartner, todaysDeliveries);
  }

  async updateStatus(id: string, status: PartnerStatus, actor: any) {
    const partner = await partnerRepository.findById(id);
    const updatedPartner = await partnerRepository.updateStatus(id, status);
    if (!updatedPartner) {
      throw new NotFoundError('Delivery Partner not found');
    }

    const actorId = actor?.userId || 'Unknown';
    const actorName = actor?.name || 'Unknown';
    const actorRole = actor?.role || 'SYSTEM';

    await auditLogService.createAuditLog({
      actor: { userId: actorId, name: actorName, role: actorRole },
      action: 'UPDATE_PARTNER_STATUS',
      module: 'DELIVERY_PARTNERS',
      recordId: updatedPartner._id?.toString(),
      oldValue: { status: partner?.status },
      newValue: { status: status },
      reason: `Partner status updated to ${status}`
    });

    const todaysDeliveries = await partnerRepository.countTodaysDeliveries(id);
    return mapPartnerToDTO(updatedPartner, todaysDeliveries);
  }

  async updateAvailability(id: string, availability: PartnerAvailability, actor: any) {
    const partner = await partnerRepository.findById(id);
    const updatedPartner = await partnerRepository.updateAvailability(id, availability);
    if (!updatedPartner) {
      throw new NotFoundError('Delivery Partner not found');
    }

    const actorId = actor?.userId || 'Unknown';
    const actorName = actor?.name || 'Unknown';
    const actorRole = actor?.role || 'SYSTEM';

    await auditLogService.createAuditLog({
      actor: { userId: actorId, name: actorName, role: actorRole },
      action: 'UPDATE_PARTNER',
      module: 'DELIVERY_PARTNERS',
      recordId: updatedPartner._id?.toString(),
      oldValue: { availability: partner?.availability },
      newValue: { availability: availability },
      reason: `Partner availability updated to ${availability}`
    });

    const todaysDeliveries = await partnerRepository.countTodaysDeliveries(id);
    return mapPartnerToDTO(updatedPartner, todaysDeliveries);
  }
}

export const partnerService = new PartnerService();
