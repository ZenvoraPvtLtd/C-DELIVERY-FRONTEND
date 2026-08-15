export const DELIVERY_STATUS = {
  WAITING_FOR_ASSIGNMENT: 'WAITING_FOR_ASSIGNMENT',
  ASSIGNED: 'ASSIGNED',
  PICKED_UP: 'PICKED_UP',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
} as const;

export type DeliveryStatus = keyof typeof DELIVERY_STATUS;

export const DELIVERY_PRIORITY = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW'
} as const;

export type DeliveryPriority = keyof typeof DELIVERY_PRIORITY;

export const FAILURE_STATUS = {
  OPEN: 'OPEN',
  INVESTIGATING: 'INVESTIGATING',
  RESOLVED: 'RESOLVED'
} as const;

export type FailureStatus = keyof typeof FAILURE_STATUS;
