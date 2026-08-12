import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export function Badge({ children, variant = 'default', className = '', ...props }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
