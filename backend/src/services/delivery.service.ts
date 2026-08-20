import { deliveryRepository } from '../repositories/delivery.repository';
import { mapDeliveryToDTO, mapTimelineEventToDTO, mapAssignmentToDTO } from '../utils/delivery.mapper';
import { auditLogService } from '../services/auditLog.service';
import { notificationService } from '../services/notification.service';
import { NotFoundError, ValidationError } from '../utils/errors';
import { DeliveryStatus } from '../constants/deliveryStatus';
import { ROLES } from '../constants/roles';

// Define valid transitions
const validTransitions: Record<string, string[]> = {
  WAITING_FOR_ASSIGNMENT: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['PICKED_UP', 'WAITING_FOR_ASSIGNMENT', 'CANCELLED', 'FAILED'],
  PICKED_UP: ['OUT_FOR_DELIVERY', 'FAILED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED'],
  DELIVERED: [],
  FAILED: ['ASSIGNED'], // Retry scenario if applicable
  CANCELLED: []
};

export class DeliveryService {
  async getDeliveries(filters: any, page: number, limit: number) {
    const result = await deliveryRepository.getDeliveries(filters, page, limit);
    return {
      data: result.data.map(mapDeliveryToDTO),
      meta: result.meta
    };
  }

  async getDashboardSummary(filters: any) {
    return await deliveryRepository.getDashboardSummary(filters);
  }

  async getDeliveryById(orderId: string) {
    const delivery = await deliveryRepository.findByOrderId(orderId);
    if (!delivery) {
      throw new NotFoundError('Delivery not found');
    }

    const deliveryIdStr = delivery._id?.toString() || '';
    
    const [timeline, assignments] = await Promise.all([
      deliveryRepository.getTimeline(deliveryIdStr),
      deliveryRepository.getAssignments(deliveryIdStr)
    ]);

    return {
      delivery: mapDeliveryToDTO(delivery),
      timeline: timeline.map(mapTimelineEventToDTO),
      assignments: assignments.map(mapAssignmentToDTO)
    };
  }

  async updateStatus(orderId: string, newStatus: DeliveryStatus, actor: any, failureReason?: string) {
    const delivery = await deliveryRepository.findByOrderId(orderId);
    if (!delivery) {
      throw new NotFoundError('Delivery not found');
    }

    const currentStatus = delivery.status;
    const allowedNext = validTransitions[currentStatus] || [];
    
    if (!allowedNext.includes(newStatus)) {
      throw new ValidationError(`Invalid transition from ${currentStatus} to ${newStatus}`);
    }

    const updates: any = { status: newStatus };
    const now = new Date();

    if (newStatus === 'ASSIGNED') updates.assignedAt = now;
    if (newStatus === 'PICKED_UP') updates.pickupAt = now;
    if (newStatus === 'OUT_FOR_DELIVERY') updates.outForDeliveryAt = now;
    if (newStatus === 'DELIVERED') updates.deliveredAt = now;
    if (newStatus === 'FAILED') {
      updates.failedAt = now;
      updates.failureReason = failureReason;
      updates.attemptCount = (delivery.attemptCount || 0) + 1;
    }

    const updatedDelivery = await deliveryRepository.updateDeliveryStatus(delivery._id?.toString() || '', updates);
    if (!updatedDelivery) {
      throw new NotFoundError('Delivery could not be updated');
    }

    // Create Timeline Event
    const actorId = typeof actor === 'string' ? actor : actor?.userId;
    const actorRole = typeof actor === 'string' ? undefined : actor?.role;

    await deliveryRepository.createTimelineEvent({
      deliveryId: delivery._id,
      orderId,
      status: newStatus,
      previousStatus: currentStatus,
      eventType: 'STATUS_CHANGE',
      actorId,
      actorRole,
      notes: failureReason || `Status updated to ${newStatus}`,
      timestamp: now
    });

    // Create Audit Log
    const actorName = typeof actor === 'string' ? 'Unknown' : actor?.name || 'Unknown';
    let auditAction = 'UPDATE_DELIVERY_STATUS';
    if (newStatus === 'FAILED') auditAction = 'MARK_DELIVERY_FAILED';
    if (newStatus === 'DELIVERED') auditAction = 'COMPLETE_DELIVERY';

    await auditLogService.createAuditLog({
      actor: {
        userId: actorId,
        name: actorName,
        role: actorRole || 'SYSTEM'
      },
      action: auditAction,
      module: 'DELIVERY',
      recordId: delivery._id?.toString(),
      oldValue: { status: currentStatus },
      newValue: { status: newStatus, failureReason },
      reason: failureReason || `Delivery status changed from ${currentStatus} to ${newStatus}`
    });

    // Create Notification
    let notificationPriority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL' = 'NORMAL';
    if (newStatus === 'FAILED') notificationPriority = 'HIGH';
    
    // We only notify for certain key transitions to avoid spam
    if (['PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED'].includes(newStatus)) {
      await notificationService.notifyRoles([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DELIVERY_MANAGER], {
        type: newStatus === 'FAILED' ? 'DELIVERY_FAILED' : 'DELIVERY_STATUS_UPDATE',
        title: `Delivery ${newStatus.replace(/_/g, ' ')}`,
        message: newStatus === 'FAILED' 
          ? `Delivery ${orderId} failed. Reason: ${failureReason || 'Unknown'}`
          : `Delivery ${orderId} is now ${newStatus.replace(/_/g, ' ')}.`,
        entityType: 'DELIVERY',
        entityId: orderId,
        priority: notificationPriority
      }).catch(console.error);
    }

    return await this.getDeliveryById(orderId);
  }
}

export const deliveryService = new DeliveryService();
