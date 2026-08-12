"use client";
import React, { useState } from 'react';
import { useAuditLogs } from '@/features/audit/hooks/useAuditLogs';
import { PageHeader } from '@/components/layout/PageHeader';
import { AuditFilterBar } from '@/features/audit/components/AuditFilterBar';
import { AuditTable } from '@/features/audit/components/AuditTable';
import { AuditDetailDrawer } from '@/features/audit/components/AuditDetailDrawer';
import { ErrorState } from '@/components/ui/ErrorState';
import { AuditLog } from '@/types/audit';
import { RouteGuard } from '@/features/auth/RouteGuard';

export default function AuditLogsPage() {
  const {
    data, isLoading, error, filters, updateFilters, clearFilters, page, setPage, refresh
  } = useAuditLogs();

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  return (
    <RouteGuard permission="AUDIT_VIEW">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        <PageHeader 
          title="Audit Logs" 
          description="Track delivery assignments, status changes, reassignments and operational actions."
        />

        <AuditFilterBar 
          filters={filters}
          onFilterChange={updateFilters}
          onClear={clearFilters}
          onRefresh={refresh}
          isRefreshing={isLoading}
        />

        {error ? (
          <ErrorState title="Unable to load audit logs" description={error} onRetry={refresh} />
        ) : (
          <AuditTable 
            data={data?.data || []}
            total={data?.total || 0}
            page={page}
            limit={data?.limit || 25}
            totalPages={data?.totalPages || 1}
            onPageChange={setPage}
            isLoading={isLoading}
            onViewDetail={setSelectedLog}
          />
        )}

        <AuditDetailDrawer log={selectedLog} onClose={() => setSelectedLog(null)} />
      </div>
    </RouteGuard>
  );
}
