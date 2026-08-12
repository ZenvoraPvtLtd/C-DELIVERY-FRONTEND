"use client";
import React, { useState, useEffect } from 'react';
import { DeliveryOrder, AssignmentHistoryRecord } from '@/types/delivery';
import { DeliveryPartner } from '@/types/partner';
import { partnerService } from '@/services/partners/partnerService';
import { Clock, User } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface AssignmentHistoryViewProps {
  order: DeliveryOrder;
}

export function AssignmentHistoryView({ order }: AssignmentHistoryViewProps) {
  const [partners, setPartners] = useState<Record<string, DeliveryPartner>>({});

  useEffect(() => {
    const fetchPartners = async () => {
      const ids = Array.from(new Set(order.assignmentHistory.map(h => h.partnerId)));
      if (ids.length === 0) return;

      const cache: Record<string, DeliveryPartner> = {};
      for (const id of ids) {
        try {
          const p = await partnerService.getPartnerById(id);
          cache[id] = p;
        } catch (e) {
          // ignore
        }
      }
      setPartners(cache);
    };

    fetchPartners();
  }, [order.assignmentHistory]);

  if (!order.assignmentHistory || order.assignmentHistory.length === 0) {
    return (
      <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', padding: 'var(--spacing-4)', textAlign: 'center' }}>
        No assignment history available.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      {/* We reverse to show newest first */}
      {[...order.assignmentHistory].reverse().map(history => {
        const p = partners[history.partnerId];
        const mapVariant = (s: string) => {
          if (s === 'ACTIVE') return 'active';
          if (s === 'SUPERSEDED') return 'warning';
          if (s === 'CLOSED') return 'success';
          return 'waiting';
        };

        return (
          <div key={history.id} style={{ 
            padding: 'var(--spacing-4)', 
            border: '1px solid var(--color-border)', 
            borderRadius: 'var(--radius-md)',
            backgroundColor: history.status === 'ACTIVE' ? '#FFF7ED' : 'var(--color-surface)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <User size={16} />
                  {p?.name || history.partnerId}
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  ID: {p?.partnerId || history.partnerId}
                </div>
              </div>
              <StatusBadge status={history.status} variant={mapVariant(history.status)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', color: 'var(--color-text-secondary)' }}>
                <Clock size={14} /> Assigned: {new Date(history.assignedAt).toLocaleString()}
              </div>
              
              {history.closedAt && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', color: 'var(--color-text-secondary)' }}>
                  <Clock size={14} /> Closed: {new Date(history.closedAt).toLocaleString()}
                </div>
              )}

              {history.reason && (
                <div style={{ marginTop: 'var(--spacing-2)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text)' }}>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 2 }}>Reason</div>
                  {history.reason}
                  {history.notes && (
                    <div style={{ marginTop: 2, fontSize: 'var(--font-size-xs)' }}>{history.notes}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
