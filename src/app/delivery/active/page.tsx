"use client";
import React, { useState } from 'react';
import { useActiveDeliveries } from '@/features/tracking/hooks/useActiveDeliveries';
import { RouteGuard } from '@/features/auth/RouteGuard';
import { PageHeader } from '@/components/layout/PageHeader';
import { ActiveFilters } from '@/features/tracking/components/ActiveFilters';
import { ActiveDeliveriesTable } from '@/features/tracking/components/ActiveDeliveriesTable';
import { StatusUpdateModal } from '@/features/tracking/components/StatusUpdateModal';
import { ReassignmentDrawer } from '@/features/tracking/components/ReassignmentDrawer';
import { FailedDeliveryModal } from '@/features/tracking/components/FailedDeliveryModal';
import { ErrorState } from '@/components/ui/ErrorState';
import { DeliveryOrder } from '@/types/delivery';
import { StatusTransition } from '@/types/tracking';
import { AssignmentDrawer } from '@/features/assignments/components/AssignmentDrawer';

export default function ActiveDeliveriesPage() {
  const { data, isLoading, error, filters, updateFilters, clearFilters, page, setPage, refresh } = useActiveDeliveries();
  
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [selectedTransition, setSelectedTransition] = useState<StatusTransition | null>(null);
  
  const [isReassigning, setIsReassigning] = useState<DeliveryOrder | null>(null);
  const [isFailing, setIsFailing] = useState<DeliveryOrder | null>(null);
  const [isAssigningId, setIsAssigningId] = useState<string | null>(null);

  const handleUpdateStatusClick = (order: DeliveryOrder, transition: StatusTransition) => {
    setSelectedOrder(order);
    setSelectedTransition(transition);
  };

  const handleUpdateSuccess = () => {
    refresh();
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setSelectedTransition(null);
  };

  return (
    <RouteGuard permission="DELIVERY_VIEW">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <PageHeader 
        title="Active Deliveries" 
        description="Monitor assigned deliveries and update delivery progress."
      />

      <ActiveFilters 
        filters={filters}
        onFilterChange={updateFilters}
        onClear={clearFilters}
        onRefresh={refresh}
        isRefreshing={isLoading}
      />

      {error ? (
        <ErrorState title="Unable to load active deliveries" description={error} onRetry={refresh} />
      ) : (
        <ActiveDeliveriesTable 
          data={data?.data || []}
          total={data?.total || 0}
          page={page}
          limit={data?.limit || 10}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
          isLoading={isLoading}
          onUpdateStatusClick={handleUpdateStatusClick}
          onReassignClick={setIsReassigning}
          onFailClick={setIsFailing}
          onAssignClick={(order) => setIsAssigningId(order.orderId)}
        />
      )}

      <StatusUpdateModal 
        order={selectedOrder}
        transition={selectedTransition}
        onClose={handleCloseModal}
        onSuccess={handleUpdateSuccess}
      />

      <ReassignmentDrawer 
        order={isReassigning}
        onClose={() => setIsReassigning(null)}
        onSuccess={() => {
          setIsReassigning(null);
          refresh();
        }}
      />

      <FailedDeliveryModal 
        order={isFailing}
        onClose={() => setIsFailing(null)}
        onSuccess={() => {
          setIsFailing(null);
          refresh();
        }}
      />

      <AssignmentDrawer 
        orderId={isAssigningId}
        onClose={() => setIsAssigningId(null)}
        onAssignmentComplete={() => {
          setIsAssigningId(null);
          refresh();
        }}
      />
    </div>
    </RouteGuard>
  );
}

