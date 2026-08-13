"use client";
import React, { useState, useEffect } from 'react';
import { Search, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AssignmentWorkspaceFilters } from '@/types/assignment';

interface AssignmentFiltersBarProps {
  filters: AssignmentWorkspaceFilters;
  onFilterChange: (filters: Partial<AssignmentWorkspaceFilters>) => void;
  onClear: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function AssignmentFiltersBar({ filters, onFilterChange, onClear, onRefresh, isRefreshing }: AssignmentFiltersBarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ search: searchTerm });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)' }}>
      <div style={{ flex: 1, minWidth: 250 }}>
        <Input 
          placeholder="Search order, customer, or partner..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftSection={<Search size={16} color="var(--color-text-muted)" />}
          rightSection={
            searchTerm ? (
              <Button variant="ghost" size="icon" onClick={() => setSearchTerm('')} style={{ height: 24, width: 24, padding: 0 }}>
                <X size={14} />
              </Button>
            ) : null
          }
        />
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
        <select 
          value={filters.status || 'ALL'}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          style={{ 
            height: 40, padding: '0 var(--spacing-3)', borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)',
            fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', cursor: 'pointer'
          }}
        >
          <option value="ALL">All Statuses</option>
          <option value="WAITING_FOR_ASSIGNMENT">Pending</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="REASSIGNED">Reassigned</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select 
          value={filters.dateRange || 'ALL'}
          onChange={(e) => onFilterChange({ dateRange: e.target.value })}
          style={{ 
            height: 40, padding: '0 var(--spacing-3)', borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)',
            fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', cursor: 'pointer'
          }}
        >
          <option value="ALL">All Time</option>
          <option value="TODAY">Today</option>
          <option value="YESTERDAY">Yesterday</option>
          <option value="LAST_7_DAYS">Last 7 Days</option>
        </select>

        {(filters.search || filters.status !== 'ALL' || filters.dateRange !== 'ALL') && (
          <Button variant="ghost" onClick={onClear} style={{ color: 'var(--color-text-secondary)' }}>
            Clear
          </Button>
        )}
        
        <Button variant="outline" onClick={onRefresh} disabled={isRefreshing} title="Refresh">
          <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
        </Button>
      </div>
    </div>
  );
}
