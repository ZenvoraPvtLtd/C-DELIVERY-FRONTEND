import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <Skeleton style={{ height: 60 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--spacing-4)' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <Skeleton key={i} style={{ height: 120 }} />
        ))}
      </div>
      <Skeleton style={{ height: 160 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
        <Skeleton style={{ height: 350 }} />
        <Skeleton style={{ height: 350 }} />
      </div>
    </div>
  );
}
