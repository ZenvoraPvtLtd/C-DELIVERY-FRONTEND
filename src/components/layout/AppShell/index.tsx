"use client";
import React, { useState } from 'react';
import styles from './AppShell.module.css';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';
import { usePathname } from 'next/navigation';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === '/login') {
    return <main>{children}</main>;
  }

  return (
    <div className={styles.appShell}>
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className={styles.main}>
        <Header onMobileMenuClick={() => setMobileMenuOpen(true)} />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
