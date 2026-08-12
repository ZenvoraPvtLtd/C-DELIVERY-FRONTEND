"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/features/delivery/hooks/useDashboard';
import { PageHeader } from '@/components/layout/PageHeader';
import { DashboardFilters } from '@/features/delivery/components/DashboardFilters';
import { DashboardKpiGrid } from '@/features/delivery/components/DashboardKpiGrid';
import { DeliveryPipeline } from '@/features/delivery/components/DeliveryPipeline';
import { DeliveryTrendChart } from '@/features/delivery/components/DeliveryTrendChart';
import { RecentDeliveries } from '@/features/delivery/components/RecentDeliveries';
import { OperationalSummary } from '@/features/delivery/components/OperationalSummary';
import { PartnerAvailabilityWidget } from '@/features/delivery/components/PartnerAvailabilityWidget';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { 
    summary, pipeline, trends, recentDeliveries, partnerAvailability, 
    isLoading, error, filters, updateDateRange, refresh 
  } = useDashboard();

  const router = useRouter();

  // Quick Actions Component
  const QuickActions = () => (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        <Button variant="outline" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => router.push('/delivery/pending')}>
          View Pending Assignments
        </Button>
        <Button variant="outline" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => router.push('/delivery/active')}>
          View Active Deliveries
        </Button>
        <Button variant="outline" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => router.push('/delivery/partners')}>
          Manage Delivery Partners
        </Button>
        <Button variant="outline" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => router.push('/delivery/failed')}>
          View Failed Deliveries
        </Button>
        <Button variant="outline" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => router.push('/delivery/history')}>
          View Delivery History
        </Button>
      </CardContent>
    </Card>
  );

  const rightContent = (
    <DashboardFilters 
      dateRange={filters.dateRange} 
      onDateRangeChange={updateDateRange} 
      onRefresh={refresh} 
      isRefreshing={isLoading} 
    />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <PageHeader 
        title="Delivery Management" 
        description="Monitor and manage delivery operations from a single workspace."
        actions={rightContent}
      />

      {error ? (
        <ErrorState onRetry={refresh} title="Unable to load dashboard" description={error} />
      ) : isLoading ? (
        // Loading Skeleton State
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--spacing-4)' }}>
            {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} style={{ height: 120 }} />)}
          </div>
          <Skeleton style={{ height: 160 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
            <Skeleton style={{ height: 350 }} />
            <Skeleton style={{ height: 350 }} />
          </div>
        </div>
      ) : !summary || summary.kpis.length === 0 ? (
        // Empty State
        <EmptyState 
          title="No delivery data available" 
          description="There are no delivery records for the selected period."
          action={<Button onClick={() => updateDateRange('last30days')}>Change Date Range</Button>}
        />
      ) : (
        // Dashboard Content
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          {/* Top KPIs */}
          <DashboardKpiGrid kpis={summary.kpis} />

          {/* Pipeline */}
          <DeliveryPipeline pipeline={pipeline} />

          {/* Middle Row: Trend & Recent */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: 'var(--spacing-6)',
            alignItems: 'stretch'
          }}>
            <DeliveryTrendChart data={trends} />
            <RecentDeliveries deliveries={recentDeliveries} />
          </div>

          {/* Bottom Row: Summaries & Actions */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 'var(--spacing-6)' 
          }}>
            <OperationalSummary summary={summary} />
            {partnerAvailability && <PartnerAvailabilityWidget data={partnerAvailability} />}
            <QuickActions />
          </div>
        </div>
      )}
    </div>
  );
}
