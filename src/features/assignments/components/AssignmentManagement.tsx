"use client";
import React, { useState } from 'react';
import { useAssignmentWorkspace } from '@/features/assignments/hooks/useAssignmentWorkspace';
import { PageHeader } from '@/components/layout/PageHeader';
import { ErrorState } from '@/components/ui/ErrorState';
import { DeliveryOrder } from '@/types/delivery';
import { AssignmentSummaryCards } from './AssignmentSummaryCards';
import { AssignmentFiltersBar } from './AssignmentFiltersBar';
import { AssignmentTable } from './AssignmentTable';
import { AssignmentDrawer } from './AssignmentDrawer';
import { ReassignmentDrawer } from '@/features/tracking/components/ReassignmentDrawer';

export function AssignmentManagement() {
  const { 
    data, metrics, isLoading, error, 
    filters, updateFilters, clearFilters, 
    page, setPage, refresh 
  } = useAssignmentWorkspace();
  
  const [isAssigningId, setIsAssigningId] = useState<string | null>(null);
  const [isReassigningOrder, setIsReassigningOrder] = useState<DeliveryOrder | null>(null);

  const handleAssignmentComplete = () => {
    setIsAssigningId(null);
    refresh();
  };

  const handleReassignmentComplete = () => {
    setIsReassigningOrder(null);
    refresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <PageHeader 
        title="Assignments" 
        description="Manage delivery assignments, partner allocation and reassignment."
      />

      <AssignmentSummaryCards metrics={metrics} isLoading={isLoading} />

      <AssignmentFiltersBar 
        filters={filters}
        onFilterChange={updateFilters}
        onClear={clearFilters}
        onRefresh={refresh}
        isRefreshing={isLoading}
      />

      {error ? (
        <ErrorState title="Unable to load assignments." description={error} onRetry={refresh} />
      ) : (
        <AssignmentTable 
          data={data?.data || []}
          total={data?.total || 0}
          page={page}
          limit={data?.limit || 10}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
          isLoading={isLoading}
          onAssignClick={(order) => setIsAssigningId(order.id)}
          onReassignClick={setIsReassigningOrder}
        />
      )}

      <AssignmentDrawer 
        orderId={isAssigningId}
        onClose={() => setIsAssigningId(null)}
        onAssignmentComplete={handleAssignmentComplete}
      />

      <ReassignmentDrawer 
        order={isReassigningOrder}
        onClose={() => setIsReassigningOrder(null)}
        onSuccess={handleReassignmentComplete}
      />
    </div>
  );
}
