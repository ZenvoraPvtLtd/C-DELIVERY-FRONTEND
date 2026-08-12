"use client";
import React from 'react';
import { useAllDeliveries } from '@/features/tracking/hooks/useAllDeliveries';
import { RouteGuard } from '@/features/auth/RouteGuard';
import { PageHeader } from '@/components/layout/PageHeader';
import { AdvancedDeliveryFilters } from '@/features/tracking/components/AdvancedDeliveryFilters';
import { DeliveryListTable } from '@/features/tracking/components/DeliveryListTable';
import { ErrorState } from '@/components/ui/ErrorState';

export default function AllDeliveriesPage() {
  const { data, isLoading, error, filters, updateFilters, clearFilters, page, setPage, limit, refresh } = useAllDeliveries();

  return (
    <RouteGuard permission="DELIVERY_VIEW">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <PageHeader 
        title="All Deliveries" 
        description="View and manage delivery records across all delivery statuses."
      />

      <AdvancedDeliveryFilters 
        filters={filters}
        onFilterChange={updateFilters}
        onClear={clearFilters}
        onRefresh={refresh}
        isRefreshing={isLoading}
      />

      {error ? (
        <ErrorState title="Unable to load deliveries" description={error} onRetry={refresh} />
      ) : (
        <DeliveryListTable 
          data={data?.data || []}
          total={data?.total || 0}
          page={page}
          limit={limit}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      )}
    </div>
    </RouteGuard>
  );
}

