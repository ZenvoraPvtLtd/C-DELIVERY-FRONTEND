"use client";
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useOrderDetail } from '@/features/assignments/hooks/useOrderDetail';
import { PageHeader } from '@/components/layout/PageHeader';
import { OrderDetailView } from '@/features/assignments/components/OrderDetailView';
import { DeliveryTimeline } from '@/features/tracking/components/DeliveryTimeline';
import { StatusUpdateModal } from '@/features/tracking/components/StatusUpdateModal';
import { VALID_TRANSITIONS, StatusTransition } from '@/types/tracking';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Edit2, UserX, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

import { ReassignmentDrawer } from '@/features/tracking/components/ReassignmentDrawer';
import { FailedDeliveryModal } from '@/features/tracking/components/FailedDeliveryModal';
import { AssignmentHistoryView } from '@/features/tracking/components/AssignmentHistoryView';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const { order, assignedPartner, isLoading, error, refresh } = useOrderDetail(orderId);
  
  const [selectedTransition, setSelectedTransition] = useState<StatusTransition | null>(null);
  
  // Exception workflows
  const [isReassigning, setIsReassigning] = useState(false);
  const [isFailing, setIsFailing] = useState(false);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        <Skeleton style={{ height: 100 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
          <Skeleton style={{ height: 300 }} />
          <Skeleton style={{ height: 300 }} />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        <Button variant="ghost" style={{ width: 'fit-content' }} onClick={() => router.back()}>
          <ChevronLeft size={16} /> Back
        </Button>
        <ErrorState title="Order not found" description={error || 'Unable to load order details.'} onRetry={refresh} />
      </div>
    );
  }

  const transitions = VALID_TRANSITIONS[order.status] || [];
  const canHaveExceptions = ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(order.status);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="ghost" style={{ width: 'fit-content', color: 'var(--color-text-secondary)', padding: '0 var(--spacing-2)' }} onClick={() => router.back()}>
          <ChevronLeft size={16} /> Back
        </Button>

        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          {canHaveExceptions && (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsReassigning(true)} style={{ color: 'var(--color-text)', borderColor: 'var(--color-border)' }}>
                <UserX size={14} style={{ marginRight: 6 }} /> Reassign
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsFailing(true)} style={{ color: 'var(--color-danger)', borderColor: 'var(--color-border)' }}>
                <AlertTriangle size={14} style={{ marginRight: 6 }} /> Mark Failed
              </Button>
            </>
          )}

          {transitions.map((t, idx) => (
            <Button key={idx} variant={idx === 0 ? 'primary' : 'outline'} size="sm" onClick={() => setSelectedTransition(t)}>
              <Edit2 size={14} style={{ marginRight: 6 }} /> {t.label}
            </Button>
          ))}
        </div>
      </div>

      <PageHeader 
        title={`Order ${order.orderId}`}
        description="Delivery and assignment details."
      />

      <OrderDetailView 
        order={order} 
        assignedPartner={assignedPartner} 
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
        <Card>
          <CardHeader>
            <CardTitle>Delivery Progress</CardTitle>
          </CardHeader>
          <CardContent style={{ padding: 'var(--spacing-6)' }}>
            <DeliveryTimeline order={order} />
          </CardContent>
        </Card>

        {order.assignmentHistory && order.assignmentHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Assignment History</CardTitle>
            </CardHeader>
            <CardContent style={{ padding: 'var(--spacing-6)' }}>
              <AssignmentHistoryView order={order} />
            </CardContent>
          </Card>
        )}
      </div>

      <StatusUpdateModal 
        order={selectedTransition ? order : null}
        transition={selectedTransition}
        onClose={() => setSelectedTransition(null)}
        onSuccess={() => {
          setSelectedTransition(null);
          refresh(); 
        }}
      />

      <ReassignmentDrawer 
        order={isReassigning ? order : null}
        onClose={() => setIsReassigning(false)}
        onSuccess={() => {
          setIsReassigning(false);
          refresh();
        }}
      />

      <FailedDeliveryModal 
        order={isFailing ? order : null}
        onClose={() => setIsFailing(false)}
        onSuccess={() => {
          setIsFailing(false);
          refresh();
        }}
      />
    </div>
  );
}
