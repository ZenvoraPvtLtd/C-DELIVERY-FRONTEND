import React from 'react';
import { useRouter } from 'next/navigation';
import { KpiMetric } from '@/types/dashboard';
import { Card, CardContent } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, Minus, Package, Truck, AlertTriangle, Users, CheckCircle2 } from 'lucide-react';

interface DashboardKpiGridProps {
  kpis: KpiMetric[];
}

export function DashboardKpiGrid({ kpis }: DashboardKpiGridProps) {
  const router = useRouter();

  const getIcon = (id: string) => {
    switch (id) {
      case 'pending': return <Package size={20} color="var(--color-warning)" />;
      case 'assigned': return <Truck size={20} color="var(--color-primary)" />;
      case 'picked_up': return <Package size={20} color="var(--color-primary)" />;
      case 'out_for_delivery': return <Truck size={20} color="var(--color-primary)" />;
      case 'delivered_today': return <CheckCircle2 size={20} color="var(--color-success)" />;
      case 'failed': return <AlertTriangle size={20} color="var(--color-danger)" />;
      case 'available_partners': return <Users size={20} color="var(--color-success)" />;
      case 'busy_partners': return <Users size={20} color="var(--color-warning)" />;
      default: return <Package size={20} />;
    }
  };

  const getRoute = (id: string) => {
    switch (id) {
      case 'pending': return '/delivery/pending';
      case 'assigned': return '/delivery/active';
      case 'picked_up': return '/delivery/active';
      case 'out_for_delivery': return '/delivery/active';
      case 'delivered_today': return '/delivery/history';
      case 'failed': return '/delivery/failed';
      case 'available_partners': return '/delivery/partners';
      case 'busy_partners': return '/delivery/partners';
      default: return '/delivery';
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--spacing-4)' }}>
      {kpis.map((kpi) => (
        <Card 
          key={kpi.id} 
          interactive 
          onClick={() => router.push(getRoute(kpi.id))}
        >
          <CardContent style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{kpi.label}</span>
              <div style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
                {getIcon(kpi.id)}
              </div>
            </div>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)' }}>
              {kpi.value}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-xs)' }}>
              <span style={{ 
                display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontWeight: 500,
                color: kpi.trend === 'up' ? 'var(--color-success)' : kpi.trend === 'down' ? 'var(--color-danger)' : 'var(--color-text-secondary)' 
              }}>
                {kpi.trend === 'up' ? <TrendingUp size={14} /> : kpi.trend === 'down' ? <TrendingDown size={14} /> : <Minus size={14} />}
                {kpi.trendPercentage}%
              </span>
              <span style={{ color: 'var(--color-text-muted)' }}>{kpi.comparisonLabel}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
