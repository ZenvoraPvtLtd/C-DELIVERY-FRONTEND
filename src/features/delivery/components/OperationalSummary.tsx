import React from 'react';
import { DashboardSummary } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function OperationalSummary({ summary }: { summary: DashboardSummary }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operational Summary</CardTitle>
      </CardHeader>
      <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Total Deliveries</span>
          <span style={{ fontWeight: 600 }}>{summary.totalDeliveries}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Completed</span>
          <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>{summary.completed}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Active</span>
          <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{summary.active}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Pending</span>
          <span style={{ fontWeight: 600, color: 'var(--color-warning)' }}>{summary.pending}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Failed</span>
          <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>{summary.failed}</span>
        </div>
      </CardContent>
    </Card>
  );
}
