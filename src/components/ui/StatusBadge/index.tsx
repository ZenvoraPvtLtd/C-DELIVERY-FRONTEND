import React from 'react';
import styles from './StatusBadge.module.css';

export type StatusVariant = 'waiting' | 'assigned' | 'active' | 'success' | 'warning' | 'danger';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: string;
  variant?: StatusVariant;
}

export function StatusBadge({ status, variant = 'waiting', className = '', ...props }: StatusBadgeProps) {
  return (
    <span className={`${styles.statusBadge} ${styles[variant]} ${className}`} {...props}>
      <span className={styles.indicator} />
      {status}
    </span>
  );
}
