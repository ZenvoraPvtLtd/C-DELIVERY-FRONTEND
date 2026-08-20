"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { DeliveryOrder } from '@/types/delivery';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { ActionGuard } from '@/features/auth/ActionGuard';

interface PendingAssignmentTableProps {
  data: DeliveryOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  onAssignClick: (orderId: string) => void;
}

export function PendingAssignmentTable({ 
  data, total, page, limit, totalPages, onPageChange, isLoading, onAssignClick 
}: PendingAssignmentTableProps) {
  const router = useRouter();

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'HIGH': return 'var(--color-danger)';
      case 'MEDIUM': return 'var(--color-warning)';
      default: return 'var(--color-success)';
    }
  };

  const getWaitingTime = (dateStr: string) => {
    const diff = new Date().getTime() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hr ${minutes % 60} mins`;
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        {[1,2,3,4,5].map(i => <Skeleton key={i} style={{ height: 80 }} />)}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState 
        title="No pending assignments"
        description="All eligible deliveries have been assigned or none match your search."
      />
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Order ID</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Customer & Address</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Priority</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Waiting Time</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order, i) => {
              const waitingTime = getWaitingTime(order.orderDate);
              const isHighWaiting = waitingTime.includes('hr') || parseInt(waitingTime) > 30;
              
              return (
                <tr 
                  key={order.id} 
                  style={{ borderBottom: i === data.length - 1 ? 'none' : '1px solid var(--color-border)', transition: 'background-color 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{order.orderId}</td>
                  <td style={{ padding: 'var(--spacing-4)' }}>
                    <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>{order.customerName}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 4 }}>{order.deliveryAddress}</div>
                  </td>
                  <td style={{ padding: 'var(--spacing-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                      <div style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', backgroundColor: getPriorityColor(order.priority) }} />
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{order.priority}</span>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--spacing-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', color: isHighWaiting ? 'var(--color-danger)' : 'var(--color-text)' }}>
                      {isHighWaiting ? <AlertCircle size={14} /> : <Clock size={14} />}
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: isHighWaiting ? 600 : 400 }}>
                        {waitingTime}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--spacing-4)', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end' }}>
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/delivery/orders/${order.orderId}`)}>
                        View
                      </Button>
                    <ActionGuard permission="DELIVERY_ASSIGN">
                      <Button size="sm" onClick={() => onAssignClick(order.orderId)}>
                        Assign Partner
                      </Button>
                    </ActionGuard>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} orders
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
              <ChevronLeft size={16} />
            </Button>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 var(--spacing-3)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
              Page {page} of {totalPages}
            </div>
            <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
