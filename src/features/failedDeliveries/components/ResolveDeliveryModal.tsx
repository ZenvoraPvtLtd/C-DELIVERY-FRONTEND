"use client";
import React, { useState } from 'react';
import { DeliveryOrder } from '@/types/delivery';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle } from 'lucide-react';

interface ResolveDeliveryModalProps {
  order: DeliveryOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (orderId: string, resolution: string) => Promise<void>;
  isSubmitting: boolean;
  error?: string | null;
}

export function ResolveDeliveryModal({ order, isOpen, onClose, onResolve, isSubmitting, error }: ResolveDeliveryModalProps) {
  const [resolution, setResolution] = useState('');

  if (!order) return null;

  const handleResolve = () => {
    if (!resolution.trim()) return;
    onResolve(order.id, resolution);
  };

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
      <Button variant="primary" onClick={handleResolve} disabled={isSubmitting || !resolution.trim()}>
        {isSubmitting ? 'Resolving...' : 'Mark as Resolved'}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Resolve Failed Delivery" footer={footer}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 2 }}>Order ID</div>
          <div style={{ fontWeight: 600 }}>{order.orderId}</div>
          <div style={{ marginTop: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Failure: <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{order.failureReason || 'Other'}</span>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
            Resolution Action <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <Input 
            value={resolution} 
            onChange={e => setResolution(e.target.value)} 
            placeholder="e.g. Customer Rescheduled, Address Corrected..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleResolve();
            }}
          />
        </div>

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
