import React from 'react';
import styles from './Skeleton.module.css';

export function Skeleton({ className = '', variant = 'text', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'text' | 'title' | 'avatar' | 'button' }) {
  return <div className={`${styles.skeleton} ${styles[variant]} ${className}`} {...props} />;
}
