"use client";
import React from 'react';
import { PartnerPerformance } from '@/types/reports';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface PartnerPerformanceTableProps {
  data: PartnerPerformance[];
}

export function PartnerPerformanceTable({ data }: PartnerPerformanceTableProps) {
  const formatTime = (ms: number | null) => {
    if (ms === null) return '-';
    const mins = Math.floor(ms / 60000);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Delivery Partners</CardTitle>
      </CardHeader>
      <CardContent style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Rank</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Partner</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Delivered</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Failed</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Active</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Success Rate</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Avg Time</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 'var(--spacing-4)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No partner data available for selected filters.</td></tr>
            ) : data.map((p, i) => (
              <tr key={p.partnerId} style={{ borderBottom: i === data.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                <td style={{ padding: 'var(--spacing-4)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>#{i + 1}</td>
                <td style={{ padding: 'var(--spacing-4)', fontWeight: 500, color: 'var(--color-text)' }}>{p.partnerName}</td>
                <td style={{ padding: 'var(--spacing-4)', color: 'var(--color-success)', fontWeight: 500 }}>{p.delivered}</td>
                <td style={{ padding: 'var(--spacing-4)', color: 'var(--color-danger)' }}>{p.failed}</td>
                <td style={{ padding: 'var(--spacing-4)' }}>{p.active}</td>
                <td style={{ padding: 'var(--spacing-4)' }}>{p.successRate !== null ? `${Math.round(p.successRate)}%` : '-'}</td>
                <td style={{ padding: 'var(--spacing-4)' }}>{formatTime(p.avgDeliveryTimeMs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
