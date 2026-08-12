"use client";
import React from 'react';
import { DeliveryOrder } from '@/types/delivery';
import { DeliveryPartner } from '@/types/partner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { User, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

interface OrderDetailViewProps {
  order: DeliveryOrder;
  assignedPartner: DeliveryPartner | null;
}

export function OrderDetailView({ order, assignedPartner }: OrderDetailViewProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
      {/* Order Info */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 2 }}>Order ID</div>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-size-lg)' }}>{order.orderId}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 2 }}>Amount</div>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-size-lg)', color: 'var(--color-primary)' }}>Rs. {order.orderAmount.toFixed(2)}</div>
            </div>
          </div>

          <div style={{ paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>Customer</div>
            <div style={{ fontWeight: 500 }}>{order.customerName}</div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>{order.customerPhone}</div>
          </div>

          <div style={{ paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>Delivery Address</div>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'flex-start' }}>
              <MapPin size={16} color="var(--color-text-secondary)" style={{ marginTop: 2 }} />
              <div style={{ fontSize: 'var(--font-size-sm)' }}>{order.deliveryAddress}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Status */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Status</CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>Current Status</div>
            <StatusBadge 
              status={order.status.replace(/_/g, ' ')} 
              variant={order.status === 'WAITING_FOR_ASSIGNMENT' ? 'waiting' : (order.status === 'ASSIGNED' ? 'success' : 'active')} 
            />
          </div>

          <div style={{ paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)', flex: 1 }}>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-3)' }}>Assigned Partner</div>
            
            {order.status === 'WAITING_FOR_ASSIGNMENT' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 100, backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)' }}>
                Waiting for Assignment
              </div>
            ) : assignedPartner ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-hover)', fontWeight: 600 }}>
                    {assignedPartner.name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{assignedPartner.name}</div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{assignedPartner.partnerId} • {assignedPartner.mobile}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-2)' }}>
                  <Calendar size={14} /> Assigned: {new Date(order.assignedAt!).toLocaleString()}
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--color-danger)' }}>Partner information not available.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
