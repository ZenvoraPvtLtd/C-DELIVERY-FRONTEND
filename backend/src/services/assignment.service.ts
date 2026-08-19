import { assignmentRepository } from '../repositories/assignment.repository';
import { deliveryRepository } from '../repositories/delivery.repository';
import { partnerRepository } from '../repositories/partner.repository';
import { NotFoundError, ConflictError, ValidationError } from '../utils/errors';
import { Types } from 'mongoose';
import { IDeliveryPartner } from '../models/DeliveryPartner.model';
import { mapPartnerToDTO } from '../utils/partner.mapper';
import { mapDeliveryToDTO, mapTimelineEventToDTO, mapAssignmentToDTO } from '../utils/delivery.mapper';
import { auditLogService } from '../services/auditLog.service';
import { notificationService } from '../services/notification.service';
import { ROLES } from '../constants/roles';

export class AssignmentService {
  async getEligiblePartners(search?: string, excludePartnerId?: string) {
    const filters: any = { status: 'ACTIVE' }; // Only ACTIVE partners
    if (search) filters.search = search;
    
    // We get all active partners (with search if provided) and then check their availability manually for the frontend contract
    // The frontend API returns `{ partner: PartnerDTO, isEligible: boolean, reason?: string }`
    const partnersResult = await partnerRepository.getPartners(filters, 1, 100);
    
    let activePartners = partnersResult.data;

    if (excludePartnerId) {
      activePartners = activePartners.filter(p => p._id?.toString() !== excludePartnerId);
    }

    const eligiblePartnersResponse = await Promise.all(
      activePartners.map(async (partner) => {
        let isEligible = true;
        let reason: string | undefined;

        if (partner.availability !== 'AVAILABLE') {
          isEligible = false;
          reason = `Partner is currently ${partner.availability.toLowerCase()}`;
        }

        const todaysDeliveries = await partnerRepository.countTodaysDeliveries(partner._id?.toString() || '');
        const partnerDto = mapPartnerToDTO(partner, todaysDeliveries);

        return {
          partner: partnerDto,
          isEligible,
          reason
        };
      })
    );

    return eligiblePartnersResponse;
  }

  async validateAssignment(orderId: string, partnerCode: string) {
    const delivery = await deliveryRepository.findByOrderId(orderId);
    if (!delivery) {
      return { isValid: false, reason: 'Order not found' };
    }
    
    // Only WAITING_FOR_ASSIGNMENT is valid for initial assignment
    // For reassignment, it might be ASSIGNED, but the validation endpoint is generally used for initial assign.
    // Let's just check if it's not DELIVERED or CANCELLED or FAILED
    if (['DELIVERED', 'CANCELLED', 'FAILED'].includes(delivery.status)) {
      return { isValid: false, reason: `Order is already ${delivery.status}` };
    }

    const partner = await partnerRepository.findByPartnerCode(partnerCode);
    if (!partner) {
      return { isValid: false, reason: 'Partner not found' };
    }

    if (partner.status !== 'ACTIVE') {
      return { isValid: false, reason: 'Partner is inactive' };
    }

    if (partner.availability !== 'AVAILABLE') {
      return { isValid: false, reason: 'Partner is not available' };
    }

    return { isValid: true };
  }

  async assignPartner(orderId: string, partnerCode: string, actor: any) {
    // 1. Validation
    const validation = await this.validateAssignment(orderId, partnerCode);
    if (!validation.isValid) {
      throw new ValidationError(validation.reason || 'Invalid assignment');
    }

    const delivery = await deliveryRepository.findByOrderId(orderId);
    const partner = await partnerRepository.findByPartnerCode(partnerCode);

    if (!delivery || !partner) throw new NotFoundError('Delivery or Partner not found');

    if (delivery.status !== 'WAITING_FOR_ASSIGNMENT') {
      throw new ConflictError('Delivery is not waiting for assignment');
    }

    // Since we are not using a transaction to avoid standalone mongo issues, we do sequential updates carefully.
    const now = new Date();

    // 2. Update Delivery
    const updatedDelivery = await deliveryRepository.updateDeliveryStatus(delivery._id?.toString() || '', {
      status: 'ASSIGNED',
      partnerId: partner._id,
      assignedAt: now
    });

    if (!updatedDelivery) throw new Error('Failed to update delivery status');

    // 3. Create Assignment record
    await assignmentRepository.create({
      orderId: orderId,
      deliveryId: delivery._id,
      partnerId: partner._id,
      status: 'ACTIVE',
      assignmentType: 'MANUAL',
      assignedAt: now
    });

    // 4. Update Partner Availability
    await partnerRepository.updateAvailability(partner._id?.toString() || '', 'BUSY');

    // 5. Create Timeline Event
    const actorId = typeof actor === 'string' ? actor : actor?.userId || actor?.name;
    const actorRole = typeof actor === 'string' ? undefined : actor?.role;

    await deliveryRepository.createTimelineEvent({
      deliveryId: delivery._id,
      orderId,
      status: 'ASSIGNED',
      previousStatus: 'WAITING_FOR_ASSIGNMENT',
      eventType: 'STATUS_CHANGE',
      actorId,
      actorRole,
      notes: `Assigned to ${partner.name}`,
      timestamp: now
    });

    const actorName = typeof actor === 'string' ? 'Unknown' : actor?.name || 'Unknown';
    await auditLogService.createAuditLog({
      actor: {
        userId: actorId,
        name: actorName,
        role: actorRole || 'SYSTEM'
      },
      action: 'ASSIGN_DELIVERY',
      module: 'ASSIGNMENTS',
      recordId: delivery._id?.toString(),
      oldValue: null,
      newValue: {
        partnerId: partner._id?.toString(),
        deliveryId: delivery._id?.toString(),
        status: 'ACTIVE'
      },
      reason: `Assigned to ${partner.name}`
    });

    await notificationService.notifyRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DELIVERY_MANAGER], {
      type: 'DELIVERY_ASSIGNED',
      title: 'Delivery Assigned',
      message: `Delivery ${orderId} has been assigned to ${partner.name}.`,
      entityType: 'DELIVERY',
      entityId: orderId,
      priority: 'NORMAL'
    }).catch(console.error); // Fail silently for notifications to not break business flow

    return await this.getAssignmentResponsePayload(orderId);
  }

  async reassignDelivery(orderId: string, newPartnerCode: string, reason: string, notes: string | undefined, actor: any) {
    const delivery = await deliveryRepository.findByOrderId(orderId);
    if (!delivery) throw new NotFoundError('Order not found');

    const newPartner = await partnerRepository.findByPartnerCode(newPartnerCode);
    if (!newPartner) throw new NotFoundError('New partner not found');

    if (newPartner.status !== 'ACTIVE' || newPartner.availability !== 'AVAILABLE') {
      throw new ValidationError('New partner is not eligible for assignment');
    }

    const oldPartnerId = delivery.partnerId;
    if (oldPartnerId && oldPartnerId.toString() === newPartner._id?.toString()) {
      throw new ConflictError('New partner must be different from current partner');
    }

    const now = new Date();

    // 1. Close current assignment if exists
    const currentAssignment = await assignmentRepository.getActiveAssignmentByDeliveryId(delivery._id?.toString() || '');
    if (currentAssignment) {
      await assignmentRepository.markAsSuperseded(currentAssignment._id?.toString() || '', reason, notes);
    }

    // 2. Free up old partner
    if (oldPartnerId) {
      await partnerRepository.updateAvailability(oldPartnerId.toString(), 'AVAILABLE');
    }

    // 3. Update Delivery
    await deliveryRepository.updateDeliveryStatus(delivery._id?.toString() || '', {
      status: 'ASSIGNED',
      partnerId: newPartner._id,
      assignedAt: now
    });

    // 4. Create New Assignment record
    await assignmentRepository.create({
      orderId: orderId,
      deliveryId: delivery._id,
      partnerId: newPartner._id,
      status: 'ACTIVE',
      assignmentType: 'MANUAL',
      reason: 'Reassignment',
      assignedAt: now
    });

    // 5. Update New Partner Availability
    await partnerRepository.updateAvailability(newPartner._id?.toString() || '', 'BUSY');

    // 6. Create Timeline Event
    const actorId = typeof actor === 'string' ? actor : actor?.userId || actor?.name;
    const actorRole = typeof actor === 'string' ? undefined : actor?.role;

    await deliveryRepository.createTimelineEvent({
      deliveryId: delivery._id,
      orderId,
      status: 'ASSIGNED',
      previousStatus: delivery.status, // might already be ASSIGNED
      eventType: 'STATUS_CHANGE',
      actorId,
      actorRole,
      notes: `Reassigned to ${newPartner.name}. Reason: ${reason}`,
      timestamp: now
    });

    const actorName = typeof actor === 'string' ? 'Unknown' : actor?.name || 'Unknown';
    await auditLogService.createAuditLog({
      actor: {
        userId: actorId,
        name: actorName,
        role: actorRole || 'SYSTEM'
      },
      action: 'REASSIGN_DELIVERY',
      module: 'ASSIGNMENTS',
      recordId: delivery._id?.toString(),
      oldValue: {
        partnerId: oldPartnerId?.toString()
      },
      newValue: {
        partnerId: newPartner._id?.toString(),
        deliveryId: delivery._id?.toString(),
        status: 'ACTIVE'
      },
      reason: `Reassigned to ${newPartner.name}. Reason: ${reason}`
    });

    await notificationService.notifyRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DELIVERY_MANAGER], {
      type: 'DELIVERY_REASSIGNED',
      title: 'Delivery Reassigned',
      message: `Delivery ${orderId} reassigned to ${newPartner.name}. Reason: ${reason}`,
      entityType: 'DELIVERY',
      entityId: orderId,
      priority: 'HIGH'
    }).catch(console.error);

    return await this.getAssignmentResponsePayload(orderId);
  }

  private async getAssignmentResponsePayload(orderId: string) {
    const delivery = await deliveryRepository.findByOrderId(orderId);
    if (!delivery) throw new NotFoundError('Delivery not found after assignment');
    
    const deliveryIdStr = delivery._id?.toString() || '';
    const [timeline, assignments] = await Promise.all([
      deliveryRepository.getTimeline(deliveryIdStr),
      assignmentRepository.getAssignmentsByDeliveryId(deliveryIdStr)
    ]);

    return {
      delivery: mapDeliveryToDTO(delivery),
      timeline: timeline.map(mapTimelineEventToDTO),
      assignments: assignments.map(mapAssignmentToDTO)
    };
  }
}

export const assignmentService = new AssignmentService();
