import React from 'react';
import Link from 'next/link';
import { PackageSearch } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '100%', minHeight: '60vh', textAlign: 'center', padding: 'var(--spacing-6)'
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 'var(--radius-full)', 
        backgroundColor: 'var(--color-background)', display: 'flex', 
        alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)',
        marginBottom: 'var(--spacing-6)'
      }}>
        <PackageSearch size={40} />
      </div>
      <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-2)' }}>
        Page not found
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-8)', maxWidth: 400 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/delivery" style={{
        backgroundColor: 'var(--color-primary)', color: 'white', 
        padding: 'var(--spacing-3) var(--spacing-6)', borderRadius: 'var(--radius-md)',
        fontWeight: 'var(--font-weight-medium)', transition: 'background-color 0.2s'
      }}>
        Back to Dashboard
      </Link>
    </div>
  );
}
