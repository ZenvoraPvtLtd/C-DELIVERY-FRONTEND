"use client";
import React, { useState, useEffect } from 'react';
import { Search, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AssignmentFilters as FiltersType } from '@/types/assignment';
import { Input } from '@/components/ui/Input';

interface PendingFiltersProps {
  filters: FiltersType;
  onFilterChange: (filters: Partial<FiltersType>) => void;
  onClear: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function PendingFilters({ filters, onFilterChange, onClear, onRefresh, isRefreshing }: PendingFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Debounce search
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
          placeholder="Search order ID, customer or address..." 
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
          value={filters.priority || 'ALL'}
          onChange={(e) => onFilterChange({ priority: e.target.value })}
          style={{ 
            height: 40, padding: '0 var(--spacing-3)', borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)',
            fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', cursor: 'pointer'
          }}
        >
          <option value="ALL">All Priorities</option>
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="LOW">Low Priority</option>
        </select>

        {(filters.search || filters.priority !== 'ALL') && (
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
