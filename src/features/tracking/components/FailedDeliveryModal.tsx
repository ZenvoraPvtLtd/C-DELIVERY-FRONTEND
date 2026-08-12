"use client";
import React from 'react';
import { DeliveryOrder } from '@/types/delivery';
import { FAILURE_REASONS } from '@/types/exception';
import { useFailedDeliveryModal } from '@/features/tracking/hooks/useFailedDeliveryModal';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface FailedDeliveryModalProps {
  order: DeliveryOrder | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function FailedDeliveryModal({ order, onClose, onSuccess }: FailedDeliveryModalProps) {
  const { 
    isOpen, reason, setReason, notes, setNotes, isSubmitting, error, clearError, handleSubmit, close: closeHook
  } = useFailedDeliveryModal(order?.id || null, onSuccess);

  const handleClose = () => {
    closeHook();
    onClose();
  };

  if (!order) return null;

  const footer = (
    <>
      <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
      <Button variant="danger" onClick={handleSubmit} disabled={isSubmitting || !reason || (reason === 'Other' && !notes.trim())}>
        {isSubmitting ? 'Reporting...' : 'Confirm Failure'}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Report Delivery Issue" footer={footer}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 2 }}>Order ID</div>
          <div style={{ fontWeight: 600 }}>{order.orderId}</div>
          <div style={{ marginTop: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Customer: {order.customerName}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
            Failure Reason <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <select 
            value={reason}
            onChange={(e) => {
              setReason(e.target.value as any);
              if (error) clearError();
            }}
            style={{ 
              width: '100%', height: 40, padding: '0 var(--spacing-3)', borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)',
              fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', cursor: 'pointer'
            }}
          >
            <option value="" disabled>Select reason...</option>
            {FAILURE_REASONS.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {reason === 'Other' && (
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
              Additional Details <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <Input 
              value={notes} 
              onChange={e => { setNotes(e.target.value); if(error) clearError(); }} 
              placeholder="Provide details about the issue..."
            />
          </div>
        )}

        {error && (
          <div style={{ padding: 'var(--spacing-3)', backgroundColor: '#FEE2E2', color: '#B91C1C', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center' }}>
            <AlertCircle size={16} />
            <span style={{ flex: 1 }}>{error}</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
