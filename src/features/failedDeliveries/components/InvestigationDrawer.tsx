"use client";
import React, { useState } from 'react';
import { DeliveryOrder } from '@/types/delivery';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DeliveryTimeline } from '@/features/tracking/components/DeliveryTimeline';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AlertTriangle, Clock, MessageSquare, Send } from 'lucide-react';

interface InvestigationDrawerProps {
  order: DeliveryOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onInvestigate: (orderId: string) => Promise<void>;
  onAddNote: (orderId: string, note: string) => Promise<void>;
  isSubmitting: boolean;
}

export function InvestigationDrawer({ order, isOpen, onClose, onInvestigate, onAddNote, isSubmitting }: InvestigationDrawerProps) {
  const [noteText, setNoteText] = useState('');

  if (!order) return null;

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    await onAddNote(order.id, noteText);
    setNoteText('');
  };

  const status = order.failureStatus || 'OPEN';

  const footer = (
    <div style={{ display: 'flex', gap: 'var(--spacing-3)', width: '100%', justifyContent: 'flex-end' }}>
      <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Close</Button>
      {status === 'OPEN' && (
        <Button onClick={() => onInvestigate(order.id)} disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Mark as Investigating'}
        </Button>
      )}
    </div>
  );

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Investigate Failure" footer={footer}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        
        {/* Summary Card */}
        <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-4)' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 2 }}>Order ID</div>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>{order.orderId}</div>
            </div>
            <StatusBadge status={status} variant={status === 'OPEN' ? 'danger' : (status === 'INVESTIGATING' ? 'active' : 'success')} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Failure Reason</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontWeight: 500, color: 'var(--color-danger)', marginTop: 2 }}>
                <AlertTriangle size={14} />
                {order.failureReason || 'Other'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Failed At</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontWeight: 500, marginTop: 2 }}>
                <Clock size={14} color="var(--color-text-secondary)" />
                {order.failedAt ? new Date(order.failedAt).toLocaleString() : '-'}
              </div>
            </div>
            {order.failureDescription && (
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Description</div>
                <div style={{ fontSize: 'var(--font-size-sm)', marginTop: 2, padding: 'var(--spacing-3)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
                  {order.failureDescription}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Delivery Timeline</h3>
          <DeliveryTimeline order={order} />
        </div>

        {/* Notes Section */}
        <div>
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 'var(--spacing-4)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <MessageSquare size={16} /> Internal Notes
          </h3>
          
          {order.internalNotes && (
            <div style={{ 
              marginBottom: 'var(--spacing-4)', 
              padding: 'var(--spacing-3)', 
              backgroundColor: 'var(--color-background)', 
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              whiteSpace: 'pre-wrap'
            }}>
              {order.internalNotes}
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <Input 
              placeholder="Add an internal note..." 
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddNote();
              }}
            />
            <Button onClick={handleAddNote} disabled={isSubmitting || !noteText.trim()}>
              <Send size={16} />
            </Button>
          </div>
        </div>

      </div>
    </Drawer>
  );
}
