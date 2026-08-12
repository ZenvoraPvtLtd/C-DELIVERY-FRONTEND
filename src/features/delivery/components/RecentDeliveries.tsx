import React from 'react';
import { useRouter } from 'next/navigation';
import { RecentDelivery } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';

interface RecentDeliveriesProps {
  deliveries: RecentDelivery[];
}

export function RecentDeliveries({ deliveries }: RecentDeliveriesProps) {
  const router = useRouter();

  const getVariant = (status: string) => {
    switch(status) {
      case 'DELIVERED': return 'success';
      case 'FAILED': return 'danger';
      case 'WAITING_FOR_ASSIGNMENT': return 'waiting';
      case 'ASSIGNED': return 'assigned';
      case 'OUT_FOR_DELIVERY': return 'warning';
      default: return 'active';
    }
  };

  const getLabel = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  return (
    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <CardTitle>Recent Deliveries</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => router.push('/delivery/all')}>View All</Button>
      </CardHeader>
      <CardContent style={{ padding: 0, flex: 1 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Order ID</th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Partner</th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Status</th>
                <th style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery, i) => (
                <tr 
                  key={i} 
                  style={{ borderBottom: i === deliveries.length - 1 ? 'none' : '1px solid var(--color-border)', cursor: 'pointer', transition: 'background-color 0.2s' }}
                  onClick={() => router.push(`/delivery/orders/` + delivery.orderId)}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--color-primary-hover)' }}>{delivery.orderId}</td>
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>{delivery.partner || <span style={{color: 'var(--color-text-muted)'}}>Unassigned</span>}</td>
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)' }}>
                    <StatusBadge status={getLabel(delivery.status)} variant={getVariant(delivery.status)} />
                  </td>
                  <td style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{delivery.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
