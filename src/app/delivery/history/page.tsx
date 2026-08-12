"use client";
import React from 'react';
import { useDeliveryHistory } from '@/features/tracking/hooks/useDeliveryHistory';
import { RouteGuard } from '@/features/auth/RouteGuard';
import { PageHeader } from '@/components/layout/PageHeader';
import { AdvancedDeliveryFilters } from '@/features/tracking/components/AdvancedDeliveryFilters';
import { DeliveryListTable } from '@/features/tracking/components/DeliveryListTable';
import { ErrorState } from '@/components/ui/ErrorState';

export default function DeliveryHistoryPage() {
  const { data, isLoading, error, filters, updateFilters, clearFilters, page, setPage, limit, refresh } = useDeliveryHistory();

  return (
    <RouteGuard permission="DELIVERY_VIEW">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <PageHeader 
        title="Delivery History" 
        description="Review completed and historical delivery activity."
      />

      <AdvancedDeliveryFilters 
        filters={filters}
        onFilterChange={updateFilters}
        onClear={clearFilters}
        onRefresh={refresh}
        isRefreshing={isLoading}
        historyMode
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
          historyMode
        />
      )}
    </div>
    </RouteGuard>
  );
}

