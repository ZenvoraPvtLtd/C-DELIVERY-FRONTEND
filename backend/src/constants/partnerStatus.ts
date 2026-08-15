export const PARTNER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
} as const;

export type PartnerStatus = keyof typeof PARTNER_STATUS;

export const PARTNER_AVAILABILITY = {
  AVAILABLE: 'AVAILABLE',
  BUSY: 'BUSY',
  INACTIVE: 'INACTIVE'
} as const;

export type PartnerAvailability = keyof typeof PARTNER_AVAILABILITY;
