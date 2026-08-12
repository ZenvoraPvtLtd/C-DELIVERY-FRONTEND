import React from 'react';
import { useRouter } from 'next/navigation';
import { DeliveryPipeline as PipelineType } from '@/types/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface DeliveryPipelineProps {
  pipeline: PipelineType[];
}

export function DeliveryPipeline({ pipeline }: DeliveryPipelineProps) {
  const router = useRouter();

  const getRoute = (status: string) => {
    switch (status) {
      case 'WAITING_FOR_ASSIGNMENT': return '/delivery/pending';
      case 'ASSIGNED': return '/delivery/active?status=ASSIGNED';
      case 'PICKED_UP': return '/delivery/active?status=PICKED_UP';
      case 'OUT_FOR_DELIVERY': return '/delivery/active?status=OUT_FOR_DELIVERY';
      case 'DELIVERED': return '/delivery/history';
      case 'FAILED': return '/delivery/failed';
      default: return '/delivery';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'var(--color-success)';
      case 'FAILED': return 'var(--color-danger)';
      case 'WAITING_FOR_ASSIGNMENT': return 'var(--color-warning)';
      default: return 'var(--color-primary)';
    }
  };

  // Only show the main flow
  const mainFlow = pipeline.filter(p => !['FAILED', 'CANCELLED'].includes(p.status));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)', height: 24, marginBottom: 'var(--spacing-4)' }}>
          {mainFlow.map((stage, idx) => (
            <div 
              key={stage.status} 
              style={{ 
                flex: stage.percentage, 
                backgroundColor: getStatusColor(stage.status),
                borderRadius: idx === 0 ? 'var(--radius-full) 0 0 var(--radius-full)' : idx === mainFlow.length - 1 ? '0 var(--radius-full) var(--radius-full) 0' : 0,
                cursor: 'pointer',
                opacity: 0.8,
                transition: 'opacity 0.2s'
              }}
              onClick={() => router.push(getRoute(stage.status))}
              onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
              title={`${stage.label}: ${stage.count}`}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
          {mainFlow.map((stage) => (
            <div 
              key={stage.status} 
              style={{ flex: 1, minWidth: 100, cursor: 'pointer', padding: 'var(--spacing-2)', borderRadius: 'var(--radius-md)' }}
              onClick={() => router.push(getRoute(stage.status))}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: getStatusColor(stage.status) }} />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>{stage.label}</span>
              </div>
              <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text)' }}>
                {stage.count}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
