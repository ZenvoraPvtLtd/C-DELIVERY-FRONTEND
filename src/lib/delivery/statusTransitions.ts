import { DeliveryStatus } from '@/types/delivery';

export const VALID_TRANSITIONS: Record<DeliveryStatus, DeliveryStatus[]> = {
  'WAITING_FOR_ASSIGNMENT': ['ASSIGNED', 'CANCELLED'],
  'ASSIGNED': ['PICKED_UP', 'CANCELLED'],
  'PICKED_UP': ['OUT_FOR_DELIVERY', 'FAILED'],
  'OUT_FOR_DELIVERY': ['DELIVERED', 'FAILED'],
  'DELIVERED': [],
  'FAILED': [],
  'CANCELLED': []
};

export const canTransition = (from: DeliveryStatus, to: DeliveryStatus): boolean => {
  if (!VALID_TRANSITIONS[from]) return false;
  return VALID_TRANSITIONS[from].includes(to);
};

export const getAllowedTransitions = (status: DeliveryStatus): DeliveryStatus[] => {
  return VALID_TRANSITIONS[status] || [];
};
