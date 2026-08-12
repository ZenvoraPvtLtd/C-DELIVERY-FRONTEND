"use client";
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PartnerFilters as FiltersType, PartnerStatus, PartnerAvailability } from '@/types/partner';
import { Input } from '@/components/ui/Input';

interface PartnerFiltersProps {
  filters: FiltersType;
  onFilterChange: (filters: Partial<FiltersType>) => void;
  onClear: () => void;
}

export function PartnerFilters({ filters, onFilterChange, onClear }: PartnerFiltersProps) {
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
          placeholder="Search partner by name, ID or mobile..." 
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
          onChange={(e) => onFilterChange({ status: e.target.value as any })}
          style={{ 
            height: 40, padding: '0 var(--spacing-3)', borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)',
            fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', cursor: 'pointer'
          }}
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <select 
          value={filters.availability || 'ALL'}
          onChange={(e) => onFilterChange({ availability: e.target.value as any })}
          style={{ 
            height: 40, padding: '0 var(--spacing-3)', borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)',
            fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', cursor: 'pointer'
          }}
        >
          <option value="ALL">All Availability</option>
          <option value="AVAILABLE">Available</option>
          <option value="BUSY">Busy</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        {(filters.search || filters.status !== 'ALL' || filters.availability !== 'ALL') && (
          <Button variant="ghost" onClick={onClear} style={{ color: 'var(--color-text-secondary)' }}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
