import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function HistoryLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <Skeleton style={{ height: 60 }} />
      <Skeleton style={{ height: 50 }} />
      <Skeleton style={{ height: 400 }} />
    </div>
  );
}
