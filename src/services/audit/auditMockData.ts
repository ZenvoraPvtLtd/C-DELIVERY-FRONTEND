import { AuditLog } from '@/types/audit';

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'ADT-1001',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    actor: { userId: 'USR-ADMIN', name: 'Demo Admin', role: 'ADMIN' },
    action: 'UPDATE_PARTNER',
    module: 'DELIVERY_PARTNERS',
    recordId: 'DP001',
    oldValue: { availability: 'BUSY' },
    newValue: { availability: 'AVAILABLE' }
  },
  {
    id: 'ADT-1002',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    actor: { userId: 'USR-DELIVERY_MANAGER', name: 'Demo Delivery Manager', role: 'DELIVERY_MANAGER' },
    action: 'ASSIGN_DELIVERY',
    module: 'ASSIGNMENTS',
    recordId: 'ORD-1004',
    oldValue: { status: 'WAITING_FOR_ASSIGNMENT' },
    newValue: { status: 'ASSIGNED', partnerId: 'DP003' }
  }
];
