"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { usePartners } from '@/features/partners/hooks/usePartners';
import { RouteGuard } from '@/features/auth/RouteGuard';
import { PageHeader } from '@/components/layout/PageHeader';
import { PartnerFilters } from '@/features/partners/components/PartnerFilters';
import { PartnerTable } from '@/features/partners/components/PartnerTable';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { ErrorState } from '@/components/ui/ErrorState';

export default function PartnersPage() {
  const router = useRouter();
  const { data, isLoading, error, filters, updateFilters, clearFilters, page, setPage, refresh } = usePartners();

  const handleAdd = () => {
    router.push('/delivery/partners/new');
  };

  return (
    <RouteGuard permission="PARTNER_VIEW">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <PageHeader 
        title="Delivery Partners" 
        description="Manage delivery partners, availability and operational status."
        actions={
          <Button onClick={handleAdd}>
            <Plus size={16} /> Add Partner
          </Button>
        }
      />

      <PartnerFilters 
        filters={filters}
        onFilterChange={updateFilters}
        onClear={clearFilters}
      />

      {error ? (
        <ErrorState title="Unable to load delivery partners" description={error} onRetry={refresh} />
      ) : (
        <PartnerTable 
          data={data?.data || []}
          total={data?.total || 0}
          page={page}
          limit={data?.limit || 10}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
          isLoading={isLoading}
          onClearFilters={clearFilters}
        />
      )}
    </div>
    </RouteGuard>
  );
}

