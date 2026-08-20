import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AssignmentsLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <Skeleton style={{ height: 60 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-4)' }}>
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} style={{ height: 100 }} />
        ))}
      </div>
      <Skeleton style={{ height: 400 }} />
    </div>
  );
}
