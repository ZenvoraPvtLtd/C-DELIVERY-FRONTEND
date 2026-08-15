export const ASSIGNMENT_STATUS = {
  ACTIVE: 'ACTIVE',
  SUPERSEDED: 'SUPERSEDED',
  CLOSED: 'CLOSED'
} as const;

export type AssignmentStatus = keyof typeof ASSIGNMENT_STATUS;
