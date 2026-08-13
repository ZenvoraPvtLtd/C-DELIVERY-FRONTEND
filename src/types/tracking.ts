import { DeliveryStatus } from './delivery';

export interface ActiveDeliveryFilters {
  search?: string;
  status?: string | 'ALL';
  dateRange?: string; // 'today', 'last7days', etc.
}

export interface StatusTransition {
  from: DeliveryStatus;
  to: DeliveryStatus;
  label: string;
}

export const VALID_TRANSITIONS: Record<string, StatusTransition[]> = {
  'WAITING_FOR_ASSIGNMENT': [
    { from: 'WAITING_FOR_ASSIGNMENT', to: 'ASSIGNED', label: 'Assign Partner' }
  ],
  'ASSIGNED': [
    { from: 'ASSIGNED', to: 'PICKED_UP', label: 'Mark Picked Up' }
  ],
  'PICKED_UP': [
    { from: 'PICKED_UP', to: 'OUT_FOR_DELIVERY', label: 'Start Delivery' }
  ],
  'OUT_FOR_DELIVERY': [
    { from: 'OUT_FOR_DELIVERY', to: 'DELIVERED', label: 'Mark Delivered' },
    { from: 'OUT_FOR_DELIVERY', to: 'FAILED', label: 'Mark Failed' }
  ]
};

export interface DeliveryFilters {
  search?: string;
  status?: string | 'ALL';
  partnerId?: string | 'ALL';
  dateRange?: string | 'ALL';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FailedDeliveryFilters {
  search?: string;
  failureStatus?: string | 'ALL'; // OPEN, INVESTIGATING, RESOLVED
  failureReason?: string | 'ALL';
  partnerId?: string | 'ALL';
  dateRange?: string | 'ALL'; // TODAY, YESTERDAY, LAST_7_DAYS
}

export interface FailedDeliveryMetrics {
  totalFailed: number;
  failedToday: number;
  underInvestigation: number;
  resolved: number;
}
