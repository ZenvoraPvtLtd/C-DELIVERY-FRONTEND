"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DeliveryOrder } from '@/types/delivery';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ChevronLeft, ChevronRight, Clock, MapPin, MoreVertical, RefreshCw, Eye, Search, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { partnerService } from '@/services/partners/partnerService';
import { DeliveryPartner } from '@/types/partner';

interface FailedDeliveryTableProps {
  data: DeliveryOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  onInvestigateClick: (order: DeliveryOrder) => void;
  onResolveClick: (order: DeliveryOrder) => void;
  onRetryClick: (order: DeliveryOrder) => void;
  onReassignClick: (order: DeliveryOrder) => void;
}

export function FailedDeliveryTable({ 
  data, total, page, limit, totalPages, onPageChange, isLoading, 
  onInvestigateClick, onResolveClick, onRetryClick, onReassignClick
}: FailedDeliveryTableProps) {
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

    fetchPartners();
  }, [data]);

  const mapVariant = (status: string) => {
    if (status === 'OPEN') return 'danger';
    if (status === 'INVESTIGATING') return 'active';
    if (status === 'RESOLVED') return 'success';
    return 'waiting';
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
        title="No failed deliveries"
        description="Great — there are no failed deliveries matching your current filters."
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
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Failure Reason</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Failed At</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Status</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Attempts</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order, i) => {
              const partner = order.partnerId ? partnerCache[order.partnerId] : null;
              const isMenuOpen = openMenuId === order.id;
              const status = order.failureStatus || 'OPEN';
              
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
                      <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>Unassigned</span>
                    )}
                  </td>
                  <td style={{ padding: 'var(--spacing-4)' }}>
                    <div style={{ fontWeight: 500 }}>{order.failureReason || 'Other'}</div>
                  </td>
                  <td style={{ padding: 'var(--spacing-4)' }}>
                    {order.failedAt ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        <Clock size={14} />
                        {new Date(order.failedAt).toLocaleString()}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>-</span>
                    )}
                  </td>
                  <td style={{ padding: 'var(--spacing-4)' }}>
                    <StatusBadge 
                      status={status} 
                      variant={mapVariant(status)}
                    />
                  </td>
                  <td style={{ padding: 'var(--spacing-4)' }}>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      {order.attemptCount || 1} Attempt(s)
                    </div>
                  </td>
                  <td style={{ padding: 'var(--spacing-4)', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 'var(--spacing-2)', position: 'relative' }}>
                      {status === 'OPEN' && (
                        <Button size="sm" onClick={() => onInvestigateClick(order)}>
                          <Search size={14} style={{ marginRight: 6 }} /> Investigate
                        </Button>
                      )}
                      {status === 'INVESTIGATING' && (
                        <Button size="sm" variant="outline" onClick={() => onResolveClick(order)}>
                          <CheckCircle2 size={14} style={{ marginRight: 6 }} /> Resolve
                        </Button>
                      )}
                      {status === 'RESOLVED' && (
                        <Button size="sm" variant="outline" onClick={() => router.push(`/delivery/orders/` + order.orderId)}>
                          <Eye size={14} style={{ marginRight: 6 }} /> View
                        </Button>
                      )}
                      
                      <Button variant="ghost" size="icon" onClick={() => setOpenMenuId(isMenuOpen ? null : order.id)}>
                        <MoreVertical size={16} />
                      </Button>

                      {isMenuOpen && (
                        <>
                          <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setOpenMenuId(null)} />
                          <div style={{ 
                            position: 'absolute', right: 0, top: '100%', marginTop: 'var(--spacing-1)',
                            backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            zIndex: 20, minWidth: 160, overflow: 'hidden'
                          }}>
                            {status !== 'RESOLVED' && (
                              <button 
                                onClick={() => { setOpenMenuId(null); onInvestigateClick(order); }}
                                style={{ 
                                  width: '100%', padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'left',
                                  backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                                  fontSize: 'var(--font-size-sm)', color: 'var(--color-text)',
                                  display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <Search size={14} /> Investigate
                              </button>
                            )}
                            {status === 'INVESTIGATING' && (
                              <button 
                                onClick={() => { setOpenMenuId(null); onResolveClick(order); }}
                                style={{ 
                                  width: '100%', padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'left',
                                  backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                                  fontSize: 'var(--font-size-sm)', color: 'var(--color-text)',
                                  display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <CheckCircle2 size={14} /> Mark as Resolved
                              </button>
                            )}
                            <button 
                              onClick={() => { setOpenMenuId(null); onRetryClick(order); }}
                              style={{ 
                                width: '100%', padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'left',
                                backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                                fontSize: 'var(--font-size-sm)', color: 'var(--color-text)',
                                display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
                              onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <RefreshCw size={14} /> Retry Delivery
                            </button>
                            {order.partnerId && (
                              <button 
                                onClick={() => { setOpenMenuId(null); onReassignClick(order); }}
                                style={{ 
                                  width: '100%', padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'left',
                                  backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                                  fontSize: 'var(--font-size-sm)', color: 'var(--color-text)',
                                  display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <RefreshCw size={14} /> Reassign Partner
                              </button>
                            )}
                            <button 
                              onClick={() => { setOpenMenuId(null); router.push(`/delivery/orders/` + order.orderId); }}
                              style={{ 
                                width: '100%', padding: 'var(--spacing-3) var(--spacing-4)', textAlign: 'left',
                                backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                                fontSize: 'var(--font-size-sm)', color: 'var(--color-text)',
                                display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)',
                                transition: 'background-color 0.2s'
                              }}
                              onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
                              onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Eye size={14} /> View Details
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ padding: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-background)' }}>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of {total} deliveries
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
            <ChevronLeft size={16} />
          </Button>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 var(--spacing-3)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
            Page {page} of {totalPages}
          </div>
          <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
