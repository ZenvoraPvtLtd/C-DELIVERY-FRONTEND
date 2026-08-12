export interface DeliveryReportFilters {
  dateRange: string;
  status?: string | 'ALL';
  partnerId?: string | 'ALL';
  search?: string;
}

export interface DeliveryReportKPI {
  pendingAssignment: number;
  assigned: number;
  pickedUp: number;
  outForDelivery: number;
  deliveredToday: number;
  failedOrException: number;
  availablePartners: number;
  busyPartners: number;
}

export interface DeliveryStatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface DeliveryTrendPoint {
  date: string;
  assigned: number;
  outForDelivery: number;
  delivered: number;
  failed: number;
  total: number;
}

export interface PartnerPerformance {
  partnerId: string;
  partnerName: string;
  delivered: number;
  failed: number;
  active: number;
  successRate: number | null;
  avgDeliveryTimeMs: number | null;
}

export interface DeliveryTimeAnalytics {
  avgAssignmentToPickupMs: number | null;
  avgPickupToOutMs: number | null;
  avgOutToDeliveredMs: number | null;
  avgOverallMs: number | null;
  fastestOverallMs: number | null;
  longestOverallMs: number | null;
}

export interface DeliverySummaryRow {
  date: string;
  total: number;
  assigned: number;
  pickedUp: number;
  outForDelivery: number;
  delivered: number;
  failed: number;
  cancelled: number;
}
