export type Permission = 
  | 'DELIVERY_VIEW'
  | 'DELIVERY_ASSIGN'
  | 'DELIVERY_REASSIGN'
  | 'DELIVERY_STATUS_UPDATE'
  | 'DELIVERY_COMPLETE'
  | 'DELIVERY_FAIL'
  | 'PARTNER_VIEW'
  | 'PARTNER_CREATE'
  | 'PARTNER_EDIT'
  | 'PARTNER_STATUS_UPDATE'
  | 'REPORT_VIEW'
  | 'REPORT_EXPORT'
  | 'AUDIT_VIEW'
  | 'TIMELINE_VIEW';

export type Role = 
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'OPERATIONS_MANAGER'
  | 'ORDER_MANAGER'
  | 'CATALOG_MANAGER'
  | 'DELIVERY_MANAGER'
  | 'CUSTOMER_SUPPORT'
  | 'REPORTS_MANAGER';

export interface CurrentUser {
  userId: string;
  name: string;
  role: Role;
  permissions: Permission[];
}
