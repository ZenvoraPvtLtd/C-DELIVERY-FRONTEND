"use client";
import React from 'react';
import { DeliveryTimeAnalytics } from '@/types/reports';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Clock } from 'lucide-react';

interface TimeAnalyticsCardProps {
  data?: DeliveryTimeAnalytics;
}

export function TimeAnalyticsCard({ data }: TimeAnalyticsCardProps) {
  const formatTime = (ms: number | null | undefined) => {
    if (ms === null || ms === undefined) return '-';
    const mins = Math.floor(ms / 60000);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader>
        <CardTitle>Delivery Time Analytics</CardTitle>
      </CardHeader>
      <CardContent style={{ padding: 'var(--spacing-6)' }}>
        {!data || data.avgOverallMs === null ? (
          <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px 0' }}>
            Not enough timestamp data for selected period.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
              <div style={{ padding: 12, backgroundColor: 'var(--color-background)', borderRadius: '50%' }}>
                <Clock size={24} color="var(--color-primary)" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Average Delivery Time</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)' }}>{formatTime(data.avgOverallMs)}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
              <div style={{ padding: 'var(--spacing-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: '#F0FDF4' }}>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Fastest Delivery</div>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-success)' }}>{formatTime(data.fastestOverallMs)}</div>
              </div>
              <div style={{ padding: 'var(--spacing-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: '#FEF2F2' }}>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Longest Delivery</div>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-danger)' }}>{formatTime(data.longestOverallMs)}</div>
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--spacing-3)' }}>Segment Breakdown</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Assignment -{'>'} Pickup</span>
                  <span style={{ fontWeight: 500 }}>{formatTime(data.avgAssignmentToPickupMs)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Pickup -{'>'} Out for Delivery</span>
                  <span style={{ fontWeight: 500 }}>{formatTime(data.avgPickupToOutMs)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Out for Delivery -{'>'} Delivered</span>
                  <span style={{ fontWeight: 500 }}>{formatTime(data.avgOutToDeliveredMs)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
