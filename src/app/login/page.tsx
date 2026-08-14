"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import { Eye, EyeOff, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    let isValid = true;
    
    if (!email) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must contain at least 6 characters.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (!success) {
        setLoginError('Invalid email or password.');
      } else {
        // Redirect is handled inside login function in AuthContext
      }
    } catch (err) {
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <div className={styles.leftPattern}></div>
        <div className={styles.leftContent}>
          <div className={styles.logo}>C — DELIVERY</div>
          <h1 className={styles.title}>Enterprise Logistics<br />Workspace</h1>
          <p className={styles.subtitle}>
            Manage active deliveries, coordinate partners, and monitor operations in real-time.
          </p>
        </div>
      </div>

      <div className={styles.rightSide}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Welcome back</h2>
            <p className={styles.formSubtitle}>Sign in to your delivery operations workspace.</p>
          </div>

          {loginError && (
            <div className={styles.errorAlert} role="alert">
              <AlertCircle size={18} />
              <span>{loginError}</span>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <div className={styles.inputWrapper}>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                    if (loginError) setLoginError('');
                  }}
                  className={`${styles.input} ${emailError ? styles.hasError : ''}`}
                  placeholder="name@company.com"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {emailError && <span className={styles.errorText}>{emailError}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                    if (loginError) setLoginError('');
                  }}
                  className={`${styles.input} ${passwordError ? styles.hasError : ''}`}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && <span className={styles.errorText}>{passwordError}</span>}
            </div>

            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={styles.spinner}></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className={styles.demoAlert}>
            <div className={styles.demoTitle}>
              <Info size={16} />
              Demo Frontend Authentication
            </div>
            <p>Use the following credentials to access the workspace:</p>
            <div className={styles.demoCreds}>
              Email: <strong>admin@cdelivery.demo</strong><br />
              Password: <strong>Demo@123456</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
