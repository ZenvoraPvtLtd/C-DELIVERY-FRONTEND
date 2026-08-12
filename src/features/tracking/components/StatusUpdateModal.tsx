"use client";
import React from 'react';
import { DeliveryOrder } from '@/types/delivery';
import { StatusTransition } from '@/types/tracking';
import { useDeliveryStatusUpdate } from '@/features/tracking/hooks/useDeliveryStatusUpdate';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface StatusUpdateModalProps {
  order: DeliveryOrder | null;
  transition: StatusTransition | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function StatusUpdateModal({ order, transition, onClose, onSuccess }: StatusUpdateModalProps) {
  const { updateStatus, isUpdating, error, clearError } = useDeliveryStatusUpdate(() => {
    onSuccess();
    onClose();
  });

  if (!order || !transition) return null;

  const mapVariant = (v: string): 'active' | 'warning' | 'success' | 'danger' | 'waiting' | 'assigned' => {
     if(v === 'ASSIGNED') return 'active';
     if(v === 'PICKED_UP') return 'warning';
     if(v === 'DELIVERED') return 'success';
     if(v === 'FAILED') return 'danger';
     return 'active';
  };

  const handleConfirm = async () => {
    await updateStatus(order.id, transition.to);
  };

  return (
    <ConfirmDialog 
      isOpen={!!order && !!transition}
      title="Confirm Status Update"
      description={
        <div style={{ marginTop: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <p>Change delivery status for <strong>{order.orderId}</strong>:</p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-4)', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>Current</div>
              <StatusBadge status={transition.from.replace(/_/g, ' ')} variant={mapVariant(transition.from)} />
            </div>
            
            <ArrowRight color="var(--color-text-muted)" />
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>New</div>
              <StatusBadge status={transition.to.replace(/_/g, ' ')} variant={mapVariant(transition.to)} />
            </div>
          </div>
          
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            This action will be recorded in the delivery timeline.
          </p>

          {error && (
            <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-danger)', color: 'white', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', marginTop: 'var(--spacing-2)' }}>
              <AlertCircle size={16} />
              <span style={{ flex: 1 }}>{error}</span>
            </div>
          )}
        </div>
      }
      confirmText={isUpdating ? "Updating..." : "Confirm Update"}
      cancelText="Cancel"
      isDestructive={false}
      onConfirm={handleConfirm}
      onClose={() => {
        clearError();
        onClose();
      }}
    />
  );
}
