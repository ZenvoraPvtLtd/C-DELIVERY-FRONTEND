export type PartnerStatus = 'ACTIVE' | 'INACTIVE';
export type PartnerAvailability = 'AVAILABLE' | 'BUSY' | 'INACTIVE';

export interface DeliveryPartner {
  id: string;
  partnerId: string;
  name: string;
  mobile: string;
  email?: string;
  availability: PartnerAvailability;
  status: PartnerStatus;
  createdAt: string;
  updatedAt: string;
  // Frontend-derived display fields for list view
  todaysDeliveries?: number;
}

export interface PartnerFilters {
  search?: string;
  status?: PartnerStatus | 'ALL';
  availability?: PartnerAvailability | 'ALL';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PartnerMutationPayload {
  partnerId: string;
  name: string;
  mobile: string;
  email?: string;
  availability: PartnerAvailability;
  status: PartnerStatus;
}
