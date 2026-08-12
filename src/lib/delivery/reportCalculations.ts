import { DeliveryOrder } from '@/types/delivery';
import { DeliveryPartner } from '@/types/partner';
import {
  DeliveryReportKPI,
  DeliveryStatusDistribution,
  DeliveryTrendPoint,
  PartnerPerformance,
  DeliveryTimeAnalytics,
  DeliverySummaryRow
} from '@/types/reports';

export function calculateDeliveryKPIs(deliveries: DeliveryOrder[], partners: DeliveryPartner[]): DeliveryReportKPI {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let deliveredToday = 0;

  const kpis: DeliveryReportKPI = {
    pendingAssignment: 0,
    assigned: 0,
    pickedUp: 0,
    outForDelivery: 0,
    deliveredToday: 0,
    failedOrException: 0,
    availablePartners: partners.filter(p => p.availability === 'AVAILABLE' && p.status === 'ACTIVE').length,
    busyPartners: partners.filter(p => p.availability === 'BUSY' && p.status === 'ACTIVE').length,
  };

  deliveries.forEach(d => {
    if (d.status === 'WAITING_FOR_ASSIGNMENT') kpis.pendingAssignment++;
    else if (d.status === 'ASSIGNED') kpis.assigned++;
    else if (d.status === 'PICKED_UP') kpis.pickedUp++;
    else if (d.status === 'OUT_FOR_DELIVERY') kpis.outForDelivery++;
    else if (d.status === 'FAILED' || d.status === 'CANCELLED') kpis.failedOrException++;
    
    if (d.status === 'DELIVERED' && d.deliveredAt) {
      const dDate = new Date(d.deliveredAt);
      if (dDate >= today) deliveredToday++;
    }
  });

  kpis.deliveredToday = deliveredToday;

  return kpis;
}

export function calculateStatusDistribution(deliveries: DeliveryOrder[]): DeliveryStatusDistribution[] {
  const counts: Record<string, number> = {};
  deliveries.forEach(d => {
    counts[d.status] = (counts[d.status] || 0) + 1;
  });

  const total = deliveries.length;
  if (total === 0) return [];

  return Object.entries(counts).map(([status, count]) => ({
    status,
    count,
    percentage: Math.round((count / total) * 100)
  })).sort((a, b) => b.count - a.count);
}

export function calculateDeliveryTrend(deliveries: DeliveryOrder[], granularity: 'hourly' | 'daily'): DeliveryTrendPoint[] {
  const buckets: Record<string, DeliveryTrendPoint> = {};

  deliveries.forEach(d => {
    const dDate = new Date(d.orderDate);
    
    let key = '';
    if (granularity === 'daily') {
      key = dDate.toLocaleDateString();
    } else {
      key = `${dDate.toLocaleDateString()} ${dDate.getHours()}:00`;
    }

    if (!buckets[key]) {
      buckets[key] = { date: key, assigned: 0, outForDelivery: 0, delivered: 0, failed: 0, total: 0 };
    }

    buckets[key].total++;
    
    // Simplification for the trend, using their current status for the bucket
    if (d.status === 'ASSIGNED' || d.status === 'PICKED_UP') buckets[key].assigned++;
    else if (d.status === 'OUT_FOR_DELIVERY') buckets[key].outForDelivery++;
    else if (d.status === 'DELIVERED') buckets[key].delivered++;
    else if (d.status === 'FAILED' || d.status === 'CANCELLED') buckets[key].failed++;
  });

  return Object.values(buckets).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function calculatePartnerPerformance(deliveries: DeliveryOrder[], partners: DeliveryPartner[]): PartnerPerformance[] {
  const partnerMap: Record<string, PartnerPerformance> = {};

  partners.forEach(p => {
    partnerMap[p.id] = {
      partnerId: p.id,
      partnerName: p.name,
      delivered: 0,
      failed: 0,
      active: 0,
      successRate: null,
      avgDeliveryTimeMs: null,
    };
  });
  
  // Track durations sum
  const durationSums: Record<string, { sum: number, count: number }> = {};

  deliveries.forEach(d => {
    if (!d.partnerId || !partnerMap[d.partnerId]) return;
    
    const p = partnerMap[d.partnerId];
    if (d.status === 'DELIVERED') p.delivered++;
    else if (d.status === 'FAILED' || d.status === 'CANCELLED') p.failed++;
    else if (['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(d.status)) p.active++;

    if (d.status === 'DELIVERED' && d.assignedAt && d.deliveredAt) {
      const dur = new Date(d.deliveredAt).getTime() - new Date(d.assignedAt).getTime();
      if (!durationSums[p.partnerId]) durationSums[p.partnerId] = { sum: 0, count: 0 };
      durationSums[p.partnerId].sum += dur;
      durationSums[p.partnerId].count++;
    }
  });

  return Object.values(partnerMap).map(p => {
    if (p.delivered + p.failed > 0) {
      p.successRate = (p.delivered / (p.delivered + p.failed)) * 100;
    }
    
    if (durationSums[p.partnerId]) {
      p.avgDeliveryTimeMs = durationSums[p.partnerId].sum / durationSums[p.partnerId].count;
    }
    
    return p;
  }).sort((a, b) => b.delivered - a.delivered);
}

export function calculateTimeAnalytics(deliveries: DeliveryOrder[]): DeliveryTimeAnalytics {
  let assignToPickupSum = 0, assignToPickupCount = 0;
  let pickupToOutSum = 0, pickupToOutCount = 0;
  let outToDeliveredSum = 0, outToDeliveredCount = 0;
  let overallSum = 0, overallCount = 0;
  
  let fastest = Infinity;
  let longest = 0;

  deliveries.forEach(d => {
    if (d.assignedAt && d.pickupAt) {
      assignToPickupSum += new Date(d.pickupAt).getTime() - new Date(d.assignedAt).getTime();
      assignToPickupCount++;
    }
    if (d.pickupAt && d.outForDeliveryAt) {
      pickupToOutSum += new Date(d.outForDeliveryAt).getTime() - new Date(d.pickupAt).getTime();
      pickupToOutCount++;
    }
    if (d.outForDeliveryAt && d.deliveredAt) {
      outToDeliveredSum += new Date(d.deliveredAt).getTime() - new Date(d.outForDeliveryAt).getTime();
      outToDeliveredCount++;
    }
    
    if (d.status === 'DELIVERED' && d.assignedAt && d.deliveredAt) {
      const dur = new Date(d.deliveredAt).getTime() - new Date(d.assignedAt).getTime();
      overallSum += dur;
      overallCount++;
      if (dur < fastest) fastest = dur;
      if (dur > longest) longest = dur;
    }
  });

  return {
    avgAssignmentToPickupMs: assignToPickupCount > 0 ? assignToPickupSum / assignToPickupCount : null,
    avgPickupToOutMs: pickupToOutCount > 0 ? pickupToOutSum / pickupToOutCount : null,
    avgOutToDeliveredMs: outToDeliveredCount > 0 ? outToDeliveredSum / outToDeliveredCount : null,
    avgOverallMs: overallCount > 0 ? overallSum / overallCount : null,
    fastestOverallMs: overallCount > 0 ? fastest : null,
    longestOverallMs: overallCount > 0 ? longest : null,
  };
}

export function calculateDeliverySummary(deliveries: DeliveryOrder[]): DeliverySummaryRow[] {
  const buckets: Record<string, DeliverySummaryRow> = {};

  deliveries.forEach(d => {
    const dDate = new Date(d.orderDate).toLocaleDateString();
    if (!buckets[dDate]) {
      buckets[dDate] = { date: dDate, total: 0, assigned: 0, pickedUp: 0, outForDelivery: 0, delivered: 0, failed: 0, cancelled: 0 };
    }
    
    buckets[dDate].total++;
    if (d.status === 'ASSIGNED') buckets[dDate].assigned++;
    else if (d.status === 'PICKED_UP') buckets[dDate].pickedUp++;
    else if (d.status === 'OUT_FOR_DELIVERY') buckets[dDate].outForDelivery++;
    else if (d.status === 'DELIVERED') buckets[dDate].delivered++;
    else if (d.status === 'FAILED') buckets[dDate].failed++;
    else if (d.status === 'CANCELLED') buckets[dDate].cancelled++;
  });

  return Object.values(buckets).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
