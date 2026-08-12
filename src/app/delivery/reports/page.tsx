"use client";
import React, { useState } from 'react';
import { useDeliveryReports } from '@/features/reports/hooks/useDeliveryReports';
import { exportToCSV } from '@/lib/delivery/exportCsv';
import { RouteGuard } from '@/features/auth/RouteGuard';
import { PageHeader } from '@/components/layout/PageHeader';
import { ReportsFilterBar } from '@/features/reports/components/ReportsFilterBar';
import { ReportKPIGrid } from '@/features/reports/components/ReportKPIGrid';
import { DeliveryTrendChart } from '@/features/reports/components/DeliveryTrendChart';
import { StatusDistributionChart } from '@/features/reports/components/StatusDistributionChart';
import { PartnerPerformanceTable } from '@/features/reports/components/PartnerPerformanceTable';
import { DeliverySummaryTable } from '@/features/reports/components/DeliverySummaryTable';
import { TimeAnalyticsCard } from '@/features/reports/components/TimeAnalyticsCard';
import { ErrorState } from '@/components/ui/ErrorState';

export default function DeliveryReportsPage() {
  const { data, isLoading, error, filters, updateFilters, clearFilters, refresh } = useDeliveryReports();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    if (!data?.raw) return;
    setIsExporting(true);
    
    setTimeout(() => {
      try {
        const exportData = data.raw.map((d: any) => ({
          'Date': new Date(d.orderDate).toLocaleDateString(),
          'Order ID': d.orderId,
          'Customer': d.customerName,
          'Partner ID': d.partnerId || 'Unassigned',
          'Status': d.status,
          'Assigned At': d.assignedAt ? new Date(d.assignedAt).toLocaleString() : '',
          'Pickup At': d.pickupAt ? new Date(d.pickupAt).toLocaleString() : '',
          'Out for Delivery At': d.outForDeliveryAt ? new Date(d.outForDeliveryAt).toLocaleString() : '',
          'Delivered At': d.deliveredAt ? new Date(d.deliveredAt).toLocaleString() : '',
          'Failed At': d.failedAt ? new Date(d.failedAt).toLocaleString() : '',
          'Failure Reason': d.failureReason || ''
        }));
        
        const dateStr = filters.dateRange === 'ALL' ? 'all-time' : filters.dateRange.toLowerCase();
        exportToCSV(`delivery-report-${dateStr}-${new Date().toISOString().split('T')[0]}.csv`, exportData);
      } catch (err) {
        console.error('Export failed', err);
      } finally {
        setIsExporting(false);
      }
    }, 500); // simulate short generation time
  };

  return (
    <RouteGuard permission="REPORT_VIEW">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <PageHeader 
        title="Delivery Reports" 
        description="Analyze delivery operations, partner performance and delivery outcomes."
      />

      <ReportsFilterBar 
        filters={filters}
        onFilterChange={updateFilters}
        onClear={clearFilters}
        onRefresh={refresh}
        onExport={handleExport}
        isRefreshing={isLoading}
        isExporting={isExporting}
      />

      {error ? (
        <ErrorState title="Unable to load delivery reports" description={error} onRetry={refresh} />
      ) : (
        <>
          <ReportKPIGrid kpis={data?.kpis} isLoading={isLoading} />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-6)' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <DeliveryTrendChart data={data?.trend} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
              <StatusDistributionChart data={data?.statusDistribution} />
              <TimeAnalyticsCard data={data?.timeAnalytics} />
            </div>
            
            <div style={{ flex: 2, minWidth: 400 }}>
              <PartnerPerformanceTable data={data?.partnerPerformance || []} />
            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <DeliverySummaryTable data={data?.summary || []} />
          </div>
        </>
      )}
    </div>
    </RouteGuard>
  );
}

