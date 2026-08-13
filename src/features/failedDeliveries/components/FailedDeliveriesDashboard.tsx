"use client";
import React, { useState } from 'react';
import { useFailedDeliveries } from '../hooks/useFailedDeliveries';
import { useFailedDeliveryMetrics } from '../hooks/useFailedDeliveryMetrics';
import { useFailedDeliveryActions } from '../hooks/useFailedDeliveryActions';
import { FailedDeliveryMetricsCards } from './FailedDeliveryMetricsCards';
import { FailedDeliveryFiltersBar } from './FailedDeliveryFiltersBar';
import { FailedDeliveryTable } from './FailedDeliveryTable';
import { InvestigationDrawer } from './InvestigationDrawer';
import { ResolveDeliveryModal } from './ResolveDeliveryModal';
import { DeliveryOrder } from '@/types/delivery';
import { ReassignmentDrawer } from '@/features/tracking/components/ReassignmentDrawer';

export function FailedDeliveriesDashboard() {
  const { 
    data, isLoading, filters, updateFilters, clearFilters, page, setPage, refresh 
  } = useFailedDeliveries();
  
  const { 
    metrics, isLoading: isMetricsLoading, refresh: refreshMetrics 
  } = useFailedDeliveryMetrics();

  const handleRefreshAll = () => {
    refresh();
    refreshMetrics();
  };

  const {
    isSubmitting, error, investigate, resolve, retry, addNote, clearError
  } = useFailedDeliveryActions(() => {
    handleRefreshAll();
    // Close modals on success
    if (selectedOrder) {
      if (investigationOpen) {
        // If we were just marking as investigating, we keep the drawer open to add notes
        // but if the status changed, we update the selected order to reflect it
        setSelectedOrder(prev => prev ? { ...prev, failureStatus: 'INVESTIGATING' } : null);
      }
    }
    setResolveModalOpen(false);
  });

  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [investigationOpen, setInvestigationOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [reassignDrawerOpen, setReassignDrawerOpen] = useState(false);

  const handleInvestigateClick = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    setInvestigationOpen(true);
  };

  const handleResolveClick = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    clearError();
    setResolveModalOpen(true);
  };

  const handleRetryClick = async (order: DeliveryOrder) => {
    if (confirm(`Are you sure you want to retry delivery for order ${order.orderId}? This will reset its assignment status.`)) {
      await retry(order.id);
    }
  };

  const handleReassignClick = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    setReassignDrawerOpen(true);
  };

  const handleInvestigate = async (orderId: string) => {
    await investigate(orderId);
  };

  const handleAddNote = async (orderId: string, note: string) => {
    await addNote(orderId, note);
    handleRefreshAll();
    setSelectedOrder(prev => prev ? { ...prev, internalNotes: prev.internalNotes ? prev.internalNotes + '\n[Note]: ' + note : '[Note]: ' + note } : null);
  };

  const handleResolve = async (orderId: string, resolution: string) => {
    await resolve(orderId, resolution);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text)', margin: 0, marginBottom: 'var(--spacing-2)' }}>
            Failed Deliveries
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            Review failed deliveries, understand failure reasons and take corrective actions.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <FailedDeliveryMetricsCards metrics={metrics} isLoading={isMetricsLoading} />

      {/* Main Content Area */}
      <div>
        <FailedDeliveryFiltersBar 
          filters={filters}
          onFilterChange={updateFilters}
          onClear={clearFilters}
          onRefresh={handleRefreshAll}
          isRefreshing={isLoading || isMetricsLoading}
        />

        <FailedDeliveryTable 
          data={data?.data || []}
          total={data?.total || 0}
          page={data?.page || 1}
          limit={data?.limit || 10}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
          isLoading={isLoading}
          onInvestigateClick={handleInvestigateClick}
          onResolveClick={handleResolveClick}
          onRetryClick={handleRetryClick}
          onReassignClick={handleReassignClick}
        />
      </div>

      {/* Modals and Drawers */}
      <InvestigationDrawer 
        order={selectedOrder}
        isOpen={investigationOpen}
        onClose={() => setInvestigationOpen(false)}
        onInvestigate={handleInvestigate}
        onAddNote={handleAddNote}
        isSubmitting={isSubmitting}
      />

      <ResolveDeliveryModal 
        order={selectedOrder}
        isOpen={resolveModalOpen}
        onClose={() => { setResolveModalOpen(false); clearError(); }}
        onResolve={handleResolve}
        isSubmitting={isSubmitting}
        error={error}
      />

      {reassignDrawerOpen && (
        <ReassignmentDrawer 
          order={selectedOrder}
          onClose={() => setReassignDrawerOpen(false)}
          onSuccess={() => {
            setReassignDrawerOpen(false);
            handleRefreshAll();
          }}
        />
      )}
    </div>
  );
}
