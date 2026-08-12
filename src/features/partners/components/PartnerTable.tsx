"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeliveryPartner } from '@/types/partner';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { MoreHorizontal, Edit, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

interface PartnerTableProps {
  data: DeliveryPartner[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  onClearFilters: () => void;
}

export function PartnerTable({ data, total, page, totalPages, onPageChange, isLoading, onClearFilters }: PartnerTableProps) {
  const router = useRouter();

  const getAvailabilityVariant = (a: string) => {
    switch (a) {
      case 'AVAILABLE': return 'success';
      case 'BUSY': return 'warning';
      default: return 'waiting';
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        {[1,2,3,4,5].map(i => <Skeleton key={i} style={{ height: 60 }} />)}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState 
        title="No delivery partners found"
        description="There are no partners matching your current filters."
        action={
          <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
            <Button variant="outline" onClick={onClearFilters}>Clear Filters</Button>
            <Button onClick={() => router.push('/delivery/partners/new')}>Add Partner</Button>
          </div>
        }
      />
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Partner ID</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Name</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Mobile</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Availability</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Status</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((partner, i) => (
              <tr 
                key={partner.id} 
                style={{ borderBottom: i === data.length - 1 ? 'none' : '1px solid var(--color-border)', transition: 'background-color 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{partner.partnerId}</td>
                <td style={{ padding: 'var(--spacing-4)' }}>
                  <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>{partner.name}</div>
                  {partner.email && <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{partner.email}</div>}
                </td>
                <td style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>{partner.mobile}</td>
                <td style={{ padding: 'var(--spacing-4)' }}>
                  <StatusBadge 
                    status={partner.availability.charAt(0) + partner.availability.slice(1).toLowerCase()} 
                    variant={getAvailabilityVariant(partner.availability)} 
                  />
                </td>
                <td style={{ padding: 'var(--spacing-4)' }}>
                  <StatusBadge 
                    status={partner.status === 'ACTIVE' ? 'Active' : 'Inactive'} 
                    variant={partner.status === 'ACTIVE' ? 'success' : 'waiting'} 
                  />
                </td>
                <td style={{ padding: 'var(--spacing-4)', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'flex-end' }}>
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/delivery/partners/` + partner.id)} title="View Details">
                      <Eye size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/delivery/partners/` + partner.id + `/edit`)} title="Edit Partner">
                      <Edit size={16} />
                    </Button>
                    {/* More action placeholder for future extended actions */}
                    <Button variant="ghost" size="icon" title="More Options">
                      <MoreHorizontal size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} partners
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
    </div>
  );
}

