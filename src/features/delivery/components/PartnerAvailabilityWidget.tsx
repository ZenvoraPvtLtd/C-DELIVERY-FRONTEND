import React from 'react';
import { useRouter } from 'next/navigation';
import { PartnerAvailability } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function PartnerAvailabilityWidget({ data }: { data: PartnerAvailability }) {
  const router = useRouter();
  
  return (
    <Card interactive onClick={() => router.push('/delivery/partners')}>
      <CardHeader>
        <CardTitle>Partner Availability</CardTitle>
      </CardHeader>
      <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-success)' }} />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Available</span>
          </div>
          <span style={{ fontWeight: 600 }}>{data.available}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-warning)' }} />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Busy</span>
          </div>
          <span style={{ fontWeight: 600 }}>{data.busy}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-text-muted)' }} />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Inactive</span>
          </div>
          <span style={{ fontWeight: 600 }}>{data.inactive}</span>
        </div>
      </CardContent>
    </Card>
  );
}
