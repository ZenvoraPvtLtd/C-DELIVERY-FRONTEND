"use client";
import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Clock, CheckCircle2, Activity, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { AssignmentMetrics } from '@/types/assignment';

interface AssignmentSummaryCardsProps {
  metrics: AssignmentMetrics | null;
  isLoading: boolean;
}

export function AssignmentSummaryCards({ metrics, isLoading }: AssignmentSummaryCardsProps) {
  const cards = [
    {
      title: 'Pending Assignment',
      value: metrics?.pending || 0,
      icon: Clock,
      color: 'var(--color-warning)'
    },
    {
      title: 'Assigned Today',
      value: metrics?.assignedToday || 0,
      icon: CheckCircle2,
      color: 'var(--color-success)'
    },
    {
      title: 'Active Assignments',
      value: metrics?.active || 0,
      icon: Activity,
      color: 'var(--color-primary)'
    },
    {
      title: 'Reassignments',
      value: metrics?.reassignments || 0,
      icon: RefreshCw,
      color: '#3B82F6'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
      {cards.map((card, idx) => (
        <Card key={idx}>
          <CardContent style={{ padding: 'var(--spacing-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                  {card.title}
                </p>
                {isLoading ? (
                  <Skeleton style={{ height: 32, width: 60 }} />
                ) : (
                  <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                    {card.value}
                  </h3>
                )}
              </div>
              <div style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)', color: card.color }}>
                <card.icon size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
