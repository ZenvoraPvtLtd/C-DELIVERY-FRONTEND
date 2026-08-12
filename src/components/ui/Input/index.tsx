import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftSection, rightSection, className = '', disabled, ...props }, ref) => {
    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={`${styles.inputContainer} ${error ? styles.error : ''}`}>
          {leftSection && <div className={styles.prefix}>{leftSection}</div>}
          <input
            ref={ref}
            className={styles.input}
            disabled={disabled}
            {...props}
          />
          {rightSection && <div className={styles.suffix}>{rightSection}</div>}
        </div>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
