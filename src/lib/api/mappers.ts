import { DeliveryOrder, DeliveryTimelineEvent, AssignmentHistoryRecord } from '@/types/delivery';
import { DeliveryPartner, PartnerMutationPayload } from '@/types/partner';
import { AuditLog, AuditEventPayload } from '@/types/audit';
import { 
  DeliveryDTO, PartnerDTO, AuditDTO, TimelineDTO, AssignmentHistoryDTO, 
  CreatePartnerRequest, CreateAuditRequest 
} from './dtos';

export const mapPartnerDtoToDomain = (dto: PartnerDTO): DeliveryPartner => ({
  id: dto._id,
  partnerId: dto.partner_code,
  name: dto.full_name,
  mobile: dto.contact_number,
  email: dto.email_address,
  availability: dto.availability_status,
  status: dto.account_status,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  todaysDeliveries: dto.todays_deliveries
});

export const mapDomainToPartnerRequest = (payload: PartnerMutationPayload): CreatePartnerRequest => ({
  partner_code: payload.partnerId,
  full_name: payload.name,
  contact_number: payload.mobile,
  email_address: payload.email,
  availability_status: payload.availability,
  account_status: payload.status
});

export const mapDeliveryDtoToDomain = (
  deliveryDto: DeliveryDTO, 
  timelineDtos: TimelineDTO[] = [], 
  assignmentDtos: AssignmentHistoryDTO[] = []
): DeliveryOrder => ({
  id: deliveryDto._id,
  orderId: deliveryDto.order_id,
  customerName: deliveryDto.customer_name,
  customerPhone: deliveryDto.customer_phone,
  deliveryAddress: deliveryDto.delivery_address,
  orderAmount: deliveryDto.order_amount,
  orderDate: deliveryDto.order_date,
  priority: deliveryDto.priority,
  status: deliveryDto.status,
  partnerId: deliveryDto.partner_id,
  partnerName: deliveryDto.partner_name,
  partnerCode: deliveryDto.partner_code,
  assignedAt: deliveryDto.assigned_at,
  pickupAt: deliveryDto.pickup_at,
  outForDeliveryAt: deliveryDto.out_for_delivery_at,
  deliveredAt: deliveryDto.delivered_at,
  failureReason: deliveryDto.failure_reason,
  failureNotes: deliveryDto.failure_notes,
  failedAt: deliveryDto.failed_at,
  timeline: timelineDtos.map(t => ({
    id: t._id,
    status: t.status,
    timestamp: t.timestamp,
    actor: t.actor,
    notes: t.notes
  })),
  assignmentHistory: assignmentDtos.map(a => ({
    id: a._id,
    orderId: a.order_id,
    partnerId: a.partner_id,
    assignedAt: a.assigned_at,
    closedAt: a.closed_at,
    status: a.status,
    reason: a.reason,
    notes: a.notes
  }))
});

export const mapAuditDtoToDomain = (dto: AuditDTO): AuditLog => ({
  id: dto._id,
  actor: dto.actor,
  action: dto.action as any,
  module: dto.module as any,
  recordId: dto.record_id,
  oldValue: dto.old_value,
  newValue: dto.new_value,
  reason: dto.reason,
  timestamp: dto.timestamp
});

export const mapDomainToAuditRequest = (payload: AuditEventPayload): CreateAuditRequest => ({
  actor: payload.actor,
  action: payload.action,
  module: payload.module,
  recordId: payload.recordId,
  oldValue: payload.oldValue,
  newValue: payload.newValue,
  reason: payload.reason
});
