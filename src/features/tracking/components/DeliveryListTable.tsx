"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DeliveryOrder } from '@/types/delivery';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ChevronLeft, ChevronRight, Clock, MapPin, CheckCircle2, History, IndianRupee } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { partnerService } from '@/services/partners/partnerService';
import { DeliveryPartner } from '@/types/partner';

interface DeliveryListTableProps {
  data: DeliveryOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  historyMode?: boolean;
}

export function DeliveryListTable({ 
  data, total, page, limit, totalPages, onPageChange, isLoading, historyMode = false 
}: DeliveryListTableProps) {
  const router = useRouter();
  
  const [partnerCache, setPartnerCache] = useState<Record<string, DeliveryPartner>>({});
  
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
     if(v === 'active') return 'active';
     if(v === 'warning') return 'warning';
     if(v === 'success') return 'success';
     if(v === 'danger') return 'danger';
     if(v === 'waiting') return 'waiting';
     return 'active';
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'WAITING_FOR_ASSIGNMENT': return 'waiting';
      case 'ASSIGNED': return 'active';
      case 'PICKED_UP': return 'warning';
      case 'OUT_FOR_DELIVERY': return 'active'; 
      case 'DELIVERED': return 'success';
      case 'FAILED': return 'danger';
      case 'CANCELLED': return 'danger';
      default: return 'active';
    }
  };

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
        title={historyMode ? "No delivery history found" : "No deliveries found"}
        description={historyMode ? "There are no completed or historical delivery records for the selected filters." : "There are currently no delivery records to display matching your filters."}
      />
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Order / Customer</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Delivery Partner</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Status</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Dates</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order, i) => {
              const partner = order.partnerId ? partnerCache[order.partnerId] : null;
              
              const isClosed = ['DELIVERED', 'FAILED', 'CANCELLED'].includes(order.status);
              
              return (
                <tr 
                  key={order.id} 
                  style={{ borderBottom: i === data.length - 1 ? 'none' : '1px solid var(--color-border)', transition: 'background-color 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: 'var(--spacing-4)' }}>
                    <div 
                      onClick={() => router.push(`/delivery/orders/${order.id}`)}
                      style={{ fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer', marginBottom: 2, display: 'inline-block' }}
                    >
                      {order.orderId}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>{order.customerName}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 2, marginTop: 4 }}>
                      <MapPin size={10} /> {order.deliveryAddress}
                    </div>
                  </td>
                  <td style={{ padding: 'var(--spacing-4)' }}>
                    {partner ? (
                      <div 
                        onClick={() => router.push(`/delivery/partners/${partner.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div style={{ fontWeight: 500, color: 'var(--color-primary)' }}>{partner.name}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>{partner.mobile}</div>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>Unassigned</span>
                    )}
                  </td>
                  <td style={{ padding: 'var(--spacing-4)' }}>
                    <StatusBadge 
                      status={order.status.replace(/_/g, ' ')} 
                      variant={mapVariant(getStatusVariant(order.status))}
                    />
                  </td>
                  <td style={{ padding: 'var(--spacing-4)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                        <span style={{ fontWeight: 500 }}>Ordered:</span> {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                      {(order.deliveredAt || order.failedAt) && (
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text)' }}>
                          <span style={{ fontWeight: 500 }}>{order.deliveredAt ? 'Delivered' : 'Failed'}:</span> {new Date(order.deliveredAt || order.failedAt!).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: 'var(--spacing-4)', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-3)', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/delivery/orders/${order.id}`)}>
                        Details
                      </Button>
                      
                      {isClosed ? (
                        <Button variant="outline" size="sm" onClick={() => router.push(`/delivery/orders/${order.id}`)}>
                          <History size={14} style={{ marginRight: 6 }} /> Timeline
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            if (order.status === 'WAITING_FOR_ASSIGNMENT') {
                              router.push('/delivery/pending');
                            } else {
                              router.push('/delivery/active');
                            }
                          }}
                        >
                          {order.status === 'WAITING_FOR_ASSIGNMENT' ? 'Assign' : 'Track'}
                        </Button>
                      )}
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
