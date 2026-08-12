"use client";
import React from 'react';
import { DeliveryReportKPI } from '@/types/reports';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Clock, Truck, CheckCircle2, AlertTriangle, Users, UserCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

interface ReportKPIGridProps {
  kpis?: DeliveryReportKPI;
  isLoading: boolean;
}

export function ReportKPIGrid({ kpis, isLoading }: ReportKPIGridProps) {
  if (isLoading || !kpis) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-4)' }}>
        {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} style={{ height: 120 }} />)}
      </div>
    );
  }

  const items = [
    { label: 'Pending Assignment', value: kpis.pendingAssignment, icon: <Clock size={20} color="var(--color-warning)" /> },
    { label: 'Assigned', value: kpis.assigned, icon: <UserCheck size={20} color="var(--color-primary)" /> },
    { label: 'Picked Up', value: kpis.pickedUp, icon: <Truck size={20} color="var(--color-primary)" /> },
    { label: 'Out for Delivery', value: kpis.outForDelivery, icon: <Truck size={20} color="var(--color-primary)" /> },
    { label: 'Delivered Today', value: kpis.deliveredToday, icon: <CheckCircle2 size={20} color="var(--color-success)" /> },
    { label: 'Exceptions / Failed', value: kpis.failedOrException, icon: <AlertTriangle size={20} color="var(--color-danger)" /> },
    { label: 'Available Partners', value: kpis.availablePartners, icon: <Users size={20} color="var(--color-success)" /> },
    { label: 'Busy Partners', value: kpis.busyPartners, icon: <Users size={20} color="var(--color-warning)" /> },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-4)' }}>
      {items.map((item, idx) => (
        <Card key={idx}>
          <CardContent style={{ padding: 'var(--spacing-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{item.label}</div>
              <div style={{ padding: 8, backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
                {item.icon}
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-text)' }}>
              {item.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
