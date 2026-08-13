"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DeliveryOrder } from '@/types/delivery';
import { VALID_TRANSITIONS, StatusTransition } from '@/types/tracking';
import { Button } from '@/components/ui/Button';
import { ActionGuard } from '@/features/auth/ActionGuard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ChevronLeft, ChevronRight, Clock, MapPin, MoreVertical, UserX, AlertTriangle, Edit2 } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { partnerService } from '@/services/partners/partnerService';
import { DeliveryPartner } from '@/types/partner';

interface ActiveDeliveriesTableProps {
  data: DeliveryOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  onUpdateStatusClick: (order: DeliveryOrder, transition: StatusTransition) => void;
  onReassignClick: (order: DeliveryOrder) => void;
  onFailClick: (order: DeliveryOrder) => void;
}

export function ActiveDeliveriesTable({ 
  data, total, page, limit, totalPages, onPageChange, isLoading, 
  onUpdateStatusClick, onReassignClick, onFailClick 
}: ActiveDeliveriesTableProps) {
  const router = useRouter();
  
  const [partnerCache, setPartnerCache] = useState<Record<string, DeliveryPartner>>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPartners = async () => {
      const neededIds = Array.from(new Set(data.map(d => d.partnerId).filter(Boolean) as string[]));
      const unCached = neededIds.filter(id => !partnerCache[id]);
      if (unCached.length === 0) return;
      
      const newCache = { ...partnerCache };
      for (const id of unCached) {
        try {
          const partner = await partnerService.getPartnerById(id);
          newCache[id] = partner;
        } catch (e) {}
      }
      setPartnerCache(newCache);
    };
    if (data.length > 0) fetchPartners();
  }, [data]);

  const mapVariant = (v: string): 'active' | 'warning' | 'success' | 'danger' | 'waiting' | 'assigned' => {
     if(v === 'WAITING_FOR_ASSIGNMENT') return 'waiting';
     if(v === 'ASSIGNED') return 'assigned';
     if(v === 'PICKED_UP') return 'warning';
     if(v === 'DELIVERED') return 'success';
     if(v === 'FAILED') return 'danger';
     return 'active';
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'WAITING_FOR_ASSIGNMENT': return 'waiting';
      case 'ASSIGNED': return 'assigned';
      case 'PICKED_UP': return 'warning';
      case 'OUT_FOR_DELIVERY': return 'active'; 
      default: return 'active';
    }
  };

  const getDuration = (dateStr: string) => {
    const diff = new Date().getTime() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        {[1,2,3,4,5].map(i => <Skeleton key={i} style={{ height: 90 }} />)}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState 
        title="No active deliveries"
        description="There are currently no assigned or in-progress deliveries matching your filters."
      />
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto', minHeight: openMenuId ? 300 : 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Order / Customer</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Delivery Partner</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Status</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Duration</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order, i) => {
              const partner = order.partnerId ? partnerCache[order.partnerId] : null;
              const transitions = VALID_TRANSITIONS[order.status] || [];
              const quickTransition = transitions[0]; 
              const isMenuOpen = openMenuId === order.id;
              
              return (
                <tr 
                  key={order.id} 
                  style={{ borderBottom: i === data.length - 1 ? 'none' : '1px solid var(--color-border)', transition: 'background-color 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: 'var(--spacing-4)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 2 }}>{order.orderId}</div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{order.customerName}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 2, marginTop: 4 }}>
                      <MapPin size={10} /> {order.deliveryAddress}
                    </div>
                  </td>
                  <td style={{ padding: 'var(--spacing-4)' }}>
                    {partner ? (
                      <div>
                        <div style={{ fontWeight: 500 }}>{partner.name}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>{partner.mobile}</div>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>Unknown</span>
                    )}
                  </td>
                  <td style={{ padding: 'var(--spacing-4)' }}>
                    <StatusBadge 
                      status={order.status.replace(/_/g, ' ')} 
                      variant={mapVariant(getStatusVariant(order.status))}
                    />
                  </td>
                  <td style={{ padding: 'var(--spacing-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', color: 'var(--color-text)' }}>
                      <Clock size={14} color="var(--color-text-secondary)" />
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                        {getDuration(order.assignedAt || order.orderDate)}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--spacing-4)', textAlign: 'right', position: 'relative' }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/delivery/orders/${order.id}`)}>
                        Details
                      </Button>
                      
                      {quickTransition && (
                        <ActionGuard permission={quickTransition.to === 'DELIVERED' ? 'DELIVERY_COMPLETE' : 'DELIVERY_STATUS_UPDATE'}>
                          <Button size="sm" onClick={() => onUpdateStatusClick(order, quickTransition)}>
                            {quickTransition.label}
                          </Button>
                        </ActionGuard>
                      )}

                      <div style={{ position: 'relative' }}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          style={{ padding: '0 8px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(isMenuOpen ? null : order.id);
                          }}
                        >
                          <MoreVertical size={16} />
                        </Button>
                        
                        {isMenuOpen && (
                          <div 
                            style={{
                              position: 'absolute',
                              top: '100%',
                              right: 0,
                              marginTop: 4,
                              backgroundColor: 'var(--color-surface)',
                              border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius-md)',
                              boxShadow: 'var(--shadow-lg)',
                              zIndex: 10,
                              minWidth: 160,
                              padding: 'var(--spacing-1)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ActionGuard permission="DELIVERY_REASSIGN">
                              <button 
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)',
                                  width: '100%', padding: 'var(--spacing-2) var(--spacing-3)',
                                  background: 'transparent', border: 'none', cursor: 'pointer',
                                  fontSize: 'var(--font-size-sm)', color: 'var(--color-text)',
                                  textAlign: 'left', borderRadius: 'var(--radius-sm)'
                                }}
                                onClick={() => { setOpenMenuId(null); onReassignClick(order); }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <UserX size={14} /> Reassign Partner
                              </button>
                            </ActionGuard>
                            
                            <ActionGuard permission="DELIVERY_FAIL">
                              <button 
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)',
                                  width: '100%', padding: 'var(--spacing-2) var(--spacing-3)',
                                  background: 'transparent', border: 'none', cursor: 'pointer',
                                  fontSize: 'var(--font-size-sm)', color: 'var(--color-danger)',
                                  textAlign: 'left', borderRadius: 'var(--radius-sm)'
                                }}
                                onClick={() => { setOpenMenuId(null); onFailClick(order); }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <AlertTriangle size={14} /> Report Exception
                              </button>
                            </ActionGuard>
                          </div>
                        )}
                      </div>
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
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} deliveries
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




