export const REASSIGNMENT_REASONS = [
  'Partner unavailable',
  'Operational issue',
  'Customer request',
  'Delivery delay',
  'Other'
] as const;

export const FAILURE_REASONS = [
  'Customer unavailable',
  'Partner unavailable',
  'Wrong address',
  'Operational issue',
  'Other'
] as const;

export type ReassignmentReason = typeof REASSIGNMENT_REASONS[number];
export type FailureReasonType = typeof FAILURE_REASONS[number];
