"use client";
import React, { useState } from 'react';
import { usePendingAssignments } from '@/features/assignments/hooks/usePendingAssignments';
import { RouteGuard } from '@/features/auth/RouteGuard';
import { PageHeader } from '@/components/layout/PageHeader';
import { PendingFilters } from '@/features/assignments/components/PendingFilters';
import { PendingAssignmentTable } from '@/features/assignments/components/PendingAssignmentTable';
import { AssignmentDrawer } from '@/features/assignments/components/AssignmentDrawer';
import { ErrorState } from '@/components/ui/ErrorState';

export default function PendingAssignmentPage() {
  const { data, isLoading, error, filters, updateFilters, clearFilters, page, setPage, refresh } = usePendingAssignments();
  
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleAssignClick = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleAssignmentComplete = () => {
    // A successful assignment reduces the pending list. Refresh the list.
    refresh();
  };

  return (
    <RouteGuard permission="DELIVERY_VIEW">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <PageHeader 
        title="Pending Assignment" 
        description="Orders waiting for delivery partner assignment."
      />

      <PendingFilters 
        filters={filters}
        onFilterChange={updateFilters}
        onClear={clearFilters}
        onRefresh={refresh}
        isRefreshing={isLoading}
      />

      {error ? (
        <ErrorState title="Unable to load pending assignments" description={error} onRetry={refresh} />
      ) : (
        <PendingAssignmentTable 
          data={data?.data || []}
          total={data?.total || 0}
          page={page}
          limit={data?.limit || 10}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
          isLoading={isLoading}
          onAssignClick={handleAssignClick}
        />
      )}

      {/* Assignment Drawer Modal Overlay */}
      <AssignmentDrawer 
        orderId={selectedOrderId}
        onAssignmentComplete={handleAssignmentComplete}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
    </RouteGuard>
  );
}

