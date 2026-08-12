"use client";
import React from 'react';
import { DeliverySummaryRow } from '@/types/reports';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface DeliverySummaryTableProps {
  data: DeliverySummaryRow[];
}

export function DeliverySummaryTable({ data }: DeliverySummaryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Summary (Daily)</CardTitle>
      </CardHeader>
      <CardContent style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Date</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Total</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Assigned</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Picked Up</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Out for Delivery</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Delivered</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Failed</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Cancelled</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 'var(--spacing-4)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No summary data available.</td></tr>
            ) : data.map((d, i) => (
              <tr key={d.date} style={{ borderBottom: i === data.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                <td style={{ padding: 'var(--spacing-4)', fontWeight: 500, color: 'var(--color-text)' }}>{d.date}</td>
                <td style={{ padding: 'var(--spacing-4)', fontWeight: 600 }}>{d.total}</td>
                <td style={{ padding: 'var(--spacing-4)' }}>{d.assigned}</td>
                <td style={{ padding: 'var(--spacing-4)' }}>{d.pickedUp}</td>
                <td style={{ padding: 'var(--spacing-4)' }}>{d.outForDelivery}</td>
                <td style={{ padding: 'var(--spacing-4)', color: 'var(--color-success)', fontWeight: 500 }}>{d.delivered}</td>
                <td style={{ padding: 'var(--spacing-4)', color: 'var(--color-danger)' }}>{d.failed}</td>
                <td style={{ padding: 'var(--spacing-4)' }}>{d.cancelled}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
