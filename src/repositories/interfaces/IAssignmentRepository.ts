import { DeliveryOrder, PaginatedDeliveries } from '@/types/delivery';
import { AssignmentFilters, AssignmentValidationResult } from '@/types/assignment';
import { DeliveryPartner } from '@/types/partner';
import { AuditActor } from '@/types/audit';

import { AssignmentWorkspaceFilters, AssignmentMetrics } from '@/types/assignment';

export interface IAssignmentRepository {
  getAllAssignments(filters: AssignmentWorkspaceFilters, page?: number, limit?: number): Promise<PaginatedDeliveries>;
  getAssignmentMetrics(): Promise<AssignmentMetrics>;
  getPendingAssignments(filters: AssignmentFilters, page?: number, limit?: number): Promise<PaginatedDeliveries>;
  getPartnersForAssignment(search?: string): Promise<{ partner: DeliveryPartner; isEligible: boolean; reason?: string }[]>;
  validateAssignment(orderId: string, partnerId: string): Promise<AssignmentValidationResult>;
  assignPartner(orderId: string, partnerId: string, actor?: AuditActor | string): Promise<DeliveryOrder>;
  getEligibleReassignmentPartners(orderId: string, search?: string): Promise<{ partner: DeliveryPartner; isEligible: boolean; reason?: string }[]>;
  reassignDelivery(orderId: string, newPartnerId: string, reason: string, notes?: string, actor?: AuditActor | string): Promise<DeliveryOrder>;
}

