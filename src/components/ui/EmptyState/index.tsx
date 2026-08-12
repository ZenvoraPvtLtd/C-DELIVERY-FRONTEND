import React from 'react';
import { PackageX } from 'lucide-react';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.iconWrapper}>
        {icon || <PackageX size={32} />}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
