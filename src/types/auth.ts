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
  | 'OUTLET_MANAGER'
  | 'KITCHEN_MANAGER'
  | 'DELIVERY_MANAGER'
  | 'FINANCE_MANAGER'
  | 'INVENTORY_MANAGER'
  | 'CUSTOMER_SUPPORT'
  | 'MARKETING_MANAGER';

export interface CurrentUser {
  userId: string;
  name: string;
  role: Role;
  permissions: Permission[];
}
