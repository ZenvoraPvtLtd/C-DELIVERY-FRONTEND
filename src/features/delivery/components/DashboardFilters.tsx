import React from 'react';
import { RefreshCw, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DateRange } from '@/types/dashboard';

interface DashboardFiltersProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function DashboardFilters({ dateRange, onDateRangeChange, onRefresh, isRefreshing }: DashboardFiltersProps) {
  // Today's date for display
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-1)' }}>
        <CalendarIcon size={16} style={{ margin: '0 var(--spacing-2)', color: 'var(--color-text-secondary)' }} />
        <select 
          value={dateRange} 
          onChange={(e) => onDateRangeChange(e.target.value as DateRange)}
          style={{ border: 'none', background: 'transparent', outline: 'none', padding: 'var(--spacing-1) var(--spacing-2)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', cursor: 'pointer' }}
        >
          <option value="today">Today ({today})</option>
          <option value="yesterday">Yesterday</option>
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
        </select>
      </div>
      <Button variant="outline" size="icon" onClick={onRefresh} disabled={isRefreshing} title="Refresh Dashboard">
        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} style={isRefreshing ? { animation: 'spin 1s linear infinite' } : {}} />
      </Button>
    </div>
  );
}
