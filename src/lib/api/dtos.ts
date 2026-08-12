import { DeliveryStatus, DeliveryPriority } from '@/types/delivery';
import { PartnerStatus, PartnerAvailability } from '@/types/partner';
import { AuditActor } from '@/types/audit';

export interface DeliveryDTO {
  _id: string;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  order_amount: number;
  order_date: string;
  priority: DeliveryPriority;
  status: DeliveryStatus;
  
  partner_id?: string;
  assigned_at?: string;
  pickup_at?: string;
  out_for_delivery_at?: string;
  delivered_at?: string;
  
  failure_reason?: string;
  failure_notes?: string;
  failed_at?: string;
}

export interface TimelineDTO {
  _id: string;
  order_id: string;
  status: DeliveryStatus;
  timestamp: string;
  actor?: string;
  notes?: string;
}

export interface AssignmentHistoryDTO {
  _id: string;
  order_id: string;
  partner_id: string;
  assigned_at: string;
  closed_at?: string;
  status: 'ACTIVE' | 'SUPERSEDED' | 'CLOSED';
  reason?: string;
  notes?: string;
}

export interface PartnerDTO {
  _id: string;
  partner_code: string;
  full_name: string;
  contact_number: string;
  email_address?: string;
  availability_status: PartnerAvailability;
  account_status: PartnerStatus;
  created_at: string;
  updated_at: string;
  todays_deliveries?: number;
}

export interface AuditDTO {
  _id: string;
  actor: AuditActor;
  action: string;
  module: string;
  record_id?: string;
  old_value?: any;
  new_value?: any;
  reason?: string;
  timestamp: string;
}

// Request DTOs
export interface CreatePartnerRequest {
  partner_code: string;
  full_name: string;
  contact_number: string;
  email_address?: string;
  availability_status: PartnerAvailability;
  account_status: PartnerStatus;
}

export interface UpdatePartnerRequest extends CreatePartnerRequest {}

export interface UpdateDeliveryStatusRequest {
  status: DeliveryStatus;
  failure_reason?: string;
  actor?: AuditActor | string;
}

export interface AssignDeliveryRequest {
  partner_id: string;
  actor?: AuditActor | string;
}

export interface ReassignDeliveryRequest {
  new_partner_id: string;
  reason: string;
  notes?: string;
  actor?: AuditActor | string;
}

export interface CreateAuditRequest {
  actor: AuditActor;
  action: string;
  module: string;
  recordId?: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
}
