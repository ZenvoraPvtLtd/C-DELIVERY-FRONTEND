"use client";
import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { AlertTriangle, CalendarDays, Activity, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { FailedDeliveryMetrics } from '@/types/tracking';

interface FailedDeliveryMetricsCardsProps {
  metrics: FailedDeliveryMetrics | null;
  isLoading: boolean;
}

export function FailedDeliveryMetricsCards({ metrics, isLoading }: FailedDeliveryMetricsCardsProps) {
  const cards = [
    {
      title: 'Total Failed',
      value: metrics?.totalFailed || 0,
      icon: AlertTriangle,
      color: 'var(--color-danger)'
    },
    {
      title: 'Failed Today',
      value: metrics?.failedToday || 0,
      icon: CalendarDays,
      color: 'var(--color-warning)'
    },
    {
      title: 'Under Investigation',
      value: metrics?.underInvestigation || 0,
      icon: Activity,
      color: '#3B82F6' // Blue
    },
    {
      title: 'Resolved',
      value: metrics?.resolved || 0,
      icon: CheckCircle2,
      color: 'var(--color-success)'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
      {cards.map((card, idx) => (
        <Card key={idx}>
          <CardContent style={{ padding: 'var(--spacing-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                  {card.title}
                </p>
                {isLoading ? (
                  <Skeleton style={{ height: 32, width: 60 }} />
                ) : (
                  <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                    {card.value}
                  </h3>
                )}
              </div>
              <div style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)', color: card.color }}>
                <card.icon size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
