"use client";
import React, { useState } from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import { useAuth } from '@/features/auth/AuthContext';
import { Role } from '@/types/auth';

interface HeaderProps {
  onMobileMenuClick: () => void;
}

export function Header({ onMobileMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { user, switchRole } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  
  const getPageTitle = () => {
    if (pathname === '/delivery' || pathname === '/') return 'Dashboard';
    const parts = pathname?.split('/').filter(Boolean) || [];
    if (parts.length > 1) {
      const last = parts[parts.length - 1];
      return last.charAt(0).toUpperCase() + last.slice(1).replace('-', ' ');
    }
    return 'Delivery Management';
  };

  const roles: Role[] = [
    'SUPER_ADMIN', 'ADMIN', 'DELIVERY_MANAGER', 'OPERATIONS_MANAGER', 
    'ORDER_MANAGER', 'CATALOG_MANAGER', 'CUSTOMER_SUPPORT', 'REPORTS_MANAGER'
  ];

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.mobileMenuBtn} onClick={onMobileMenuClick}>
          <Menu size={24} />
        </button>
        <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
      </div>
      
      <div className={styles.right}>
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder={searchFocused ? "Start typing to search" : "Search orders, partners, deliveries..."} 
            className={styles.searchInput}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
        
        <button className={styles.iconBtn} title="Notifications">
          <Bell size={20} />
        </button>
        
        <div style={{ position: 'relative' }}>
          <button className={styles.profileBtn} onClick={() => setShowRoleMenu(!showRoleMenu)}>
            <div className={styles.avatar}>{user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</div>
            <span className={styles.profileName}>{user.name}</span>
          </button>

          {showRoleMenu && (
            <div style={{
              position: 'absolute', top: '110%', right: 0, backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)', zIndex: 100, minWidth: 200, padding: 'var(--spacing-2)'
            }}>
              <div style={{ padding: 'var(--spacing-2)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                DEVELOPMENT MOCK
              </div>
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => { switchRole(r); setShowRoleMenu(false); }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: 'var(--spacing-2)',
                    background: user.role === r ? 'var(--color-background)' : 'transparent',
                    border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    fontSize: 'var(--font-size-sm)', color: user.role === r ? 'var(--color-primary)' : 'var(--color-text)',
                    fontWeight: user.role === r ? 600 : 400
                  }}
                >
                  {r.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
