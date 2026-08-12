"use client";
import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export function Unauthorized() {
  const router = useRouter();
  
  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', textAlign: 'center', padding: 'var(--spacing-6)'
    }}>
      <div style={{ 
        width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--color-surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-4)',
        border: '1px solid var(--color-border)'
      }}>
        <Lock size={32} color="var(--color-text-muted)" />
      </div>
      <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--spacing-2)' }}>
        Access Denied
      </h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-6)', maxWidth: 400 }}>
        You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
      </p>
      <Button onClick={() => router.push('/delivery')}>
        Go to Dashboard
      </Button>
    </div>
  );
}
