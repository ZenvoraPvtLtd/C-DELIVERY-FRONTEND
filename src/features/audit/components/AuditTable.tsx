"use client";
import React from 'react';
import { AuditLog } from '@/types/audit';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface AuditTableProps {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  onViewDetail: (log: AuditLog) => void;
}

export function AuditTable({ data, total, page, limit, totalPages, onPageChange, isLoading, onViewDetail }: AuditTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Loading audit logs...
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 500, marginBottom: 'var(--spacing-2)' }}>No audit activity</div>
          <p>There are no audit events matching the selected filters.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Timestamp</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>User</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Role</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Action</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Module</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Record ID</th>
              <th style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 500, borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((log, i) => (
              <tr key={log.id} style={{ borderBottom: i === data.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                <td style={{ padding: 'var(--spacing-4)', whiteSpace: 'nowrap', fontSize: 'var(--font-size-sm)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                <td style={{ padding: 'var(--spacing-4)', fontWeight: 500, color: 'var(--color-text)' }}>{log.actor.name}</td>
                <td style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-xs)' }}>
                  <span style={{ padding: '4px 8px', borderRadius: 4, backgroundColor: 'var(--color-background)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
                    {log.actor.role.replace(/_/g, ' ')}
                  </span>
                </td>
                <td style={{ padding: 'var(--spacing-4)', fontWeight: 500, color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)' }}>
                  {log.action.replace(/_/g, ' ')}
                </td>
                <td style={{ padding: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>{log.module}</td>
                <td style={{ padding: 'var(--spacing-4)', fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-sm)' }}>{log.recordId || '-'}</td>
                <td style={{ padding: 'var(--spacing-4)' }}>
                  <Button variant="outline" size="sm" onClick={() => onViewDetail(log)}>View Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, total)} of {total}
            </span>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => onPageChange(page - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Next</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
