"use client";
import React from 'react';
import { DeliveryOrder } from '@/types/delivery';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface DeliveryTimelineProps {
  order: DeliveryOrder;
}

export function DeliveryTimeline({ order }: DeliveryTimelineProps) {
  const STAGES = [
    { key: 'WAITING_FOR_ASSIGNMENT', label: 'Order Ready' },
    { key: 'ASSIGNED', label: 'Assigned' },
    { key: 'PICKED_UP', label: 'Picked Up' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: 'var(--spacing-2) 0' }}>
      {STAGES.map((stage, index) => {
        const isLast = index === STAGES.length - 1;
        const historyEvent = order.timeline?.find(t => t.status === stage.key);
        const isCompleted = !!historyEvent;
        
        // Find if this is the currently active step (completed, but the next one isn't)
        const nextStage = STAGES[index + 1];
        const nextEvent = nextStage ? order.timeline?.find(t => t.status === nextStage.key) : null;
        const isActive = isCompleted && !nextEvent && order.status !== 'DELIVERED' && order.status !== 'FAILED' && order.status !== 'CANCELLED';

        return (
          <div key={stage.key} style={{ display: 'flex', gap: 'var(--spacing-4)', position: 'relative' }}>
            {/* Timeline Graphic */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ 
                width: 24, height: 24, borderRadius: '50%', 
                backgroundColor: isCompleted ? 'var(--color-primary)' : 'var(--color-surface)',
                border: `2px solid ${isCompleted ? 'var(--color-primary)' : 'var(--color-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', zIndex: 1
              }}>
                {isCompleted ? <CheckCircle2 size={14} /> : <Circle size={10} color="var(--color-border)" />}
              </div>
              
              {!isLast && (
                <div style={{ 
                  width: 2, flex: 1, minHeight: 40,
                  backgroundColor: isCompleted && nextEvent ? 'var(--color-primary)' : 'var(--color-border)',
                  margin: '4px 0'
                }} />
              )}
            </div>

            {/* Timeline Content */}
            <div style={{ paddingBottom: isLast ? 0 : 'var(--spacing-6)', paddingTop: 2, flex: 1 }}>
              <div style={{ 
                fontWeight: isActive ? 600 : (isCompleted ? 500 : 400), 
                color: isActive ? 'var(--color-primary)' : (isCompleted ? 'var(--color-text)' : 'var(--color-text-muted)'),
                fontSize: 'var(--font-size-md)', marginBottom: 4 
              }}>
                {stage.label}
              </div>
              
              {isCompleted && historyEvent && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    <Clock size={12} />
                    {new Date(historyEvent.timestamp).toLocaleString()}
                  </div>
                  {historyEvent.actor && (
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      Updated by {historyEvent.actor}
                    </div>
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
