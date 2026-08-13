"use client";
import React from 'react';
import { AuditFilters } from '@/types/audit';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, RotateCcw, X, Download } from 'lucide-react';
import { ActionGuard } from '@/features/auth/ActionGuard';

interface AuditFilterBarProps {
  filters: AuditFilters;
  onFilterChange: (filters: Partial<AuditFilters>) => void;
  onClear: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function AuditFilterBar({ filters, onFilterChange, onClear, onRefresh, isRefreshing }: AuditFilterBarProps) {
  const handleExport = () => {
    alert('Exporting audit logs...');
  };

  const selectStyle = {
    padding: 'var(--spacing-2) var(--spacing-3)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontSize: 'var(--font-size-sm)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
        
        <div style={{ flex: '1 1 300px' }}>
          <Input 
            placeholder="Search audit logs..." 
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
        </div>

        <select 
          value={filters.action || 'ALL'}
          onChange={(e) => onFilterChange({ action: e.target.value as any })}
          style={{ ...selectStyle, width: 180 }}
        >
          <option value="ALL">All Actions</option>
          <option value="ASSIGN_DELIVERY">Assign Delivery</option>
          <option value="REASSIGN_DELIVERY">Reassign Delivery</option>
          <option value="UPDATE_DELIVERY_STATUS">Update Status</option>
          <option value="MARK_DELIVERY_FAILED">Mark Failed</option>
          <option value="COMPLETE_DELIVERY">Complete Delivery</option>
          <option value="UPDATE_PARTNER">Update Partner</option>
          <option value="UPDATE_PARTNER_STATUS">Update Partner Status</option>
        </select>

        <select 
          value={filters.role || 'ALL'}
          onChange={(e) => onFilterChange({ role: e.target.value })}
          style={{ ...selectStyle, width: 160 }}
        >
          <option value="ALL">All Roles</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="ADMIN">Admin</option>
          <option value="OUTLET_MANAGER">Outlet Manager</option>
          <option value="KITCHEN_MANAGER">Kitchen Manager</option>
          <option value="DELIVERY_MANAGER">Delivery Manager</option>
          <option value="FINANCE_MANAGER">Finance Manager</option>
          <option value="INVENTORY_MANAGER">Inventory Manager</option>
          <option value="CUSTOMER_SUPPORT">Customer Support</option>
          <option value="MARKETING_MANAGER">Marketing Manager</option>
          <option value="SYSTEM">System</option>
        </select>

        <select 
          value={filters.module || 'ALL'}
          onChange={(e) => onFilterChange({ module: e.target.value as any })}
          style={{ ...selectStyle, width: 150 }}
        >
          <option value="ALL">All Modules</option>
          <option value="DELIVERY">Delivery</option>
          <option value="DELIVERY_PARTNERS">Partners</option>
          <option value="ASSIGNMENTS">Assignments</option>
        </select>

        <select 
          value={filters.dateRange || 'LAST_7_DAYS'}
          onChange={(e) => onFilterChange({ dateRange: e.target.value })}
          style={{ ...selectStyle, width: 150 }}
        >
          <option value="ALL">All Time</option>
          <option value="TODAY">Today</option>
          <option value="YESTERDAY">Yesterday</option>
          <option value="LAST_7_DAYS">Last 7 Days</option>
          <option value="LAST_30_DAYS">Last 30 Days</option>
        </select>

        <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginLeft: 'auto' }}>
          <Button variant="outline" onClick={onClear} title="Clear filters">
            <X size={16} />
          </Button>
          <Button variant="outline" onClick={onRefresh} disabled={isRefreshing} title="Refresh">
            <RotateCcw size={16} className={isRefreshing ? "spin" : ""} />
          </Button>
          <ActionGuard permission="REPORT_EXPORT">
            <Button variant="outline" onClick={handleExport}>
              <Download size={16} style={{ marginRight: 8 }} />
              Export
            </Button>
          </ActionGuard>
        </div>
      </div>
    </div>
  );
}
