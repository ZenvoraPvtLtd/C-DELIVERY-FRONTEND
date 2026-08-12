export type DateRange = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom';

export interface DashboardFilters {
  dateRange: DateRange;
  customFrom?: Date;
  customTo?: Date;
  status?: string;
  partner?: string;
}

export interface KpiMetric {
  id: string;
  label: string;
  value: number | string;
  trend: 'up' | 'down' | 'neutral';
  trendPercentage: number;
  comparisonLabel: string;
}

export interface DashboardSummary {
  kpis: KpiMetric[];
  totalDeliveries: number;
  completed: number;
  active: number;
  pending: number;
  failed: number;
}

export interface DeliveryPipeline {
  status: 'WAITING_FOR_ASSIGNMENT' | 'ASSIGNED' | 'PICKED_UP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED' | 'CANCELLED';
  label: string;
  count: number;
  percentage: number;
}

export interface DeliveryTrend {
  time: string;
  Assigned: number;
  'Out for Delivery': number;
  Delivered: number;
  Failed: number;
}

export interface RecentDelivery {
  orderId: string;
  partner: string | null;
  status: string;
  time: string;
}

export interface PartnerAvailability {
  available: number;
  busy: number;
  inactive: number;
}
