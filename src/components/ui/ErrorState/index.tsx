import React from 'react';
import { AlertCircle } from 'lucide-react';
import styles from './ErrorState.module.css';
import { Button } from '../Button';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = "Something went wrong", 
  description = "We couldn't load this content. Please try again.", 
  onRetry 
}: ErrorStateProps) {
  return (
    <div className={styles.errorState}>
      <div className={styles.iconWrapper}>
        <AlertCircle size={32} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
}
