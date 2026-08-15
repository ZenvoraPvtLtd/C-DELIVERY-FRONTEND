import { IDelivery } from '../models/Delivery.model';
import { ITimelineEvent } from '../models/TimelineEvent.model';
import { IAssignment } from '../models/Assignment.model';

export const mapDeliveryToDTO = (delivery: IDelivery) => {
  return {
    _id: delivery._id?.toString(),
    order_id: delivery.orderId,
    customer_name: delivery.customerName,
    customer_phone: delivery.customerPhone,
    delivery_address: delivery.deliveryAddress,
    order_amount: delivery.orderAmount,
    order_date: delivery.orderDate?.toISOString(),
    priority: delivery.priority,
    status: delivery.status,
    
    partner_id: delivery.partnerId?.toString(),
    assigned_at: delivery.assignedAt?.toISOString(),
    pickup_at: delivery.pickupAt?.toISOString(),
    out_for_delivery_at: delivery.outForDeliveryAt?.toISOString(),
    delivered_at: delivery.deliveredAt?.toISOString(),
    
    failure_reason: delivery.failureReason,
    failure_notes: delivery.failureNotes,
    failed_at: delivery.failedAt?.toISOString()
  };
};

export const mapTimelineEventToDTO = (event: ITimelineEvent) => {
  return {
    _id: event._id?.toString(),
    order_id: event.orderId,
    status: event.status,
    timestamp: event.timestamp?.toISOString(),
    actor: event.actorId || event.actorRole,
    notes: event.notes
  };
};

export const mapAssignmentToDTO = (assignment: IAssignment) => {
  return {
    _id: assignment._id?.toString(),
    order_id: assignment.orderId,
    partner_id: assignment.partnerId?.toString(),
    assigned_at: assignment.assignedAt?.toISOString(),
    closed_at: assignment.closedAt?.toISOString(),
    status: assignment.status,
    reason: assignment.reason,
    notes: assignment.notes
  };
};
