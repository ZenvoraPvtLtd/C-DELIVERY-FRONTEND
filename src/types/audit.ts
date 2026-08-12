export type AuditAction = 
  | 'ASSIGN_DELIVERY'
  | 'REASSIGN_DELIVERY'
  | 'UPDATE_DELIVERY_STATUS'
  | 'MARK_DELIVERY_FAILED'
  | 'COMPLETE_DELIVERY'
  | 'UPDATE_PARTNER'
  | 'UPDATE_PARTNER_STATUS'
  | 'VIEW_DELIVERY'
  | 'VIEW_TIMELINE'
  | 'REPORT_EXPORT'
  | 'LOGIN'
  | 'LOGOUT';

export type AuditModule = 
  | 'DELIVERY'
  | 'DELIVERY_PARTNERS'
  | 'ASSIGNMENTS'
  | 'REPORTS'
  | 'AUDIT_LOGS';

export interface AuditActor {
  userId: string;
  name: string;
  role: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: AuditActor;
  action: AuditAction;
  module: AuditModule;
  recordId?: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
}

export type AuditEventPayload = Omit<AuditLog, 'id' | 'timestamp'>;

export interface AuditFilters {
  search?: string;
  action?: AuditAction | 'ALL';
  role?: string | 'ALL';
  module?: AuditModule | 'ALL';
  dateRange?: string;
}

export interface PaginatedAuditLogs {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
