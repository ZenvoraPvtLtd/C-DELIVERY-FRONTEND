import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  title: string;
  description?: string;
  type?: ToastType;
  onClose: () => void;
}

export function Toast({ title, description, type = 'info', onClose }: ToastProps) {
  const Icon = type === 'success' ? CheckCircle 
    : type === 'error' ? AlertCircle 
    : type === 'warning' ? AlertTriangle 
    : Info;
    
  const colorClass = type === 'success' ? 'var(--color-success)'
    : type === 'error' ? 'var(--color-danger)'
    : type === 'warning' ? 'var(--color-warning)'
    : 'var(--color-primary)';

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <Icon size={20} color={colorClass} />
      <div>
        <div className={styles.title}>{title}</div>
        {description && <div className={styles.description}>{description}</div>}
      </div>
      <button className={styles.closeBtn} onClick={onClose}><X size={16} /></button>
    </div>
  );
}
