export type DeliveryStatus = 'WAITING_FOR_ASSIGNMENT' | 'ASSIGNED' | 'PICKED_UP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED' | 'CANCELLED';
export type DeliveryPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface DeliveryTimelineEvent {
  id: string;
  status: DeliveryStatus;
  timestamp: string; // ISO
  actor?: string;
  notes?: string;
}

export interface AssignmentHistoryRecord {
  id: string;
  orderId: string;
  partnerId: string;
  assignedAt: string;
  closedAt?: string;
  status: 'ACTIVE' | 'SUPERSEDED' | 'CLOSED';
  reason?: string;
  notes?: string;
}

export interface DeliveryOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderAmount: number;
  orderDate: string; // ISO String
  priority: DeliveryPriority;
  status: DeliveryStatus;
  
  // Assignment & Tracking Info
  partnerId?: string;
  partnerName?: string;
  partnerCode?: string;
  assignedAt?: string;
  pickupAt?: string;
  outForDeliveryAt?: string;
  deliveredAt?: string;
  
  failureReason?: string;
  failureNotes?: string;
  failedAt?: string;
  
  failureStatus?: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  failureDescription?: string;
  attemptCount?: number;
  lastAttemptAt?: string;
  resolution?: string;
  resolvedAt?: string;
  internalNotes?: string;
  
  timeline: DeliveryTimelineEvent[];
  assignmentHistory: AssignmentHistoryRecord[];
}

export interface PaginatedDeliveries {
  data: DeliveryOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

