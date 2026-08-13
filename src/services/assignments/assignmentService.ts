import { DeliveryOrder, PaginatedDeliveries } from '@/types/delivery';
import { AssignmentFilters, AssignmentValidationResult, AssignmentWorkspaceFilters, AssignmentMetrics } from '@/types/assignment';
import { DeliveryPartner } from '@/types/partner';
import { repositoryFactory } from '@/repositories';
import { AuditActor } from '@/types/audit';
import { appEvents } from '@/lib/events';

export const assignmentService = {
  async getAllAssignments(filters: AssignmentWorkspaceFilters, page: number = 1, limit: number = 10): Promise<PaginatedDeliveries> {
    const repo = repositoryFactory.getAssignmentRepository();
    return repo.getAllAssignments(filters, page, limit);
  },

  async getAssignmentMetrics(): Promise<AssignmentMetrics> {
    const repo = repositoryFactory.getAssignmentRepository();
    return repo.getAssignmentMetrics();
  },
  async getPendingAssignments(filters: AssignmentFilters, page: number = 1, limit: number = 10): Promise<PaginatedDeliveries> {
    const repo = repositoryFactory.getAssignmentRepository();
    return repo.getPendingAssignments(filters, page, limit);
  },

  async getOrderDetails(orderId: string): Promise<DeliveryOrder> {
    const repo = repositoryFactory.getDeliveryRepository();
    return repo.getDeliveryById(orderId);
  },

  async getPartnersForAssignment(search?: string): Promise<{ partner: DeliveryPartner; isEligible: boolean; reason?: string }[]> {
    const repo = repositoryFactory.getAssignmentRepository();
    return repo.getPartnersForAssignment(search);
  },

  async validateAssignment(orderId: string, partnerId: string): Promise<AssignmentValidationResult> {
    const repo = repositoryFactory.getAssignmentRepository();
    return repo.validateAssignment(orderId, partnerId);
  },

  async assignPartner(orderId: string, partnerId: string, actor?: AuditActor | string): Promise<DeliveryOrder> {
    const repo = repositoryFactory.getAssignmentRepository();
    const result = await repo.assignPartner(orderId, partnerId, actor);
    appEvents.emit('refresh:assignments');
    appEvents.emit('refresh:deliveries');
    appEvents.emit('refresh:partners');
    appEvents.emit('refresh:audit');
    return result;
  }
};

