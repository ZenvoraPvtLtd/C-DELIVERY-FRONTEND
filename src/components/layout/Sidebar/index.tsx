"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePermissions } from '@/features/auth/usePermissions';
import { Permission } from '@/types/auth';
import { prefetchAssignments } from '@/features/assignments/hooks/useAssignmentWorkspace';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ClipboardList, 
  History, 
  AlertTriangle,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
  Truck
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onCollapse, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { can } = usePermissions();

  React.useEffect(() => {
    // Silently pre-warm the assignments cache so it loads instantly when clicked
    prefetchAssignments();
  }, []);

  type NavItem = { name?: string; href?: string; icon?: any; exact?: boolean; group?: string; permission?: Permission };
  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/delivery', icon: LayoutDashboard, exact: true, permission: 'DELIVERY_VIEW' },
    { group: 'Operations' },
    { name: 'Pending Assignment', href: '/delivery/pending', icon: ClipboardList, permission: 'DELIVERY_VIEW' },
    { name: 'Active Deliveries', href: '/delivery/active', icon: Package, permission: 'DELIVERY_VIEW' },
    { name: 'All Deliveries', href: '/delivery/all', icon: Package, permission: 'DELIVERY_VIEW' },
    { name: 'Delivery History', href: '/delivery/history', icon: History, permission: 'DELIVERY_VIEW' },
    { name: 'Failed Deliveries', href: '/delivery/failed', icon: AlertTriangle, permission: 'DELIVERY_VIEW' },
    { group: 'Partners' },
    { name: 'Delivery Partners', href: '/delivery/partners', icon: Users, permission: 'PARTNER_VIEW' },
    { group: 'Management' },
    { name: 'Assignments', href: '/delivery/assignments', icon: ClipboardList, permission: 'DELIVERY_VIEW' },
    { group: 'Analytics' },
    { name: 'Reports', href: '/delivery/reports', icon: BarChart3, permission: 'REPORT_VIEW' },
    { group: 'System' },
    { name: 'Audit Logs', href: '/delivery/audit-logs', icon: FileText, permission: 'AUDIT_VIEW' },
  ];

  return (
    <>
      <div 
        className={mobileOpen ? styles.mobileOverlay + ' ' + styles.mobileOpen : styles.mobileOverlay} 
        onClick={onMobileClose} 
      />
      <aside className={styles.sidebar + (collapsed ? ' ' + styles.collapsed : '') + (mobileOpen ? ' ' + styles.mobileOpen : '')}>
        <div className={styles.brand}>
          <Truck className={styles.brandIcon} size={24} />
          {!collapsed && <span>Delivery</span>}
        </div>
        
        <nav className={styles.nav}>
          {navItems.map((item, index) => {
            if (item.permission && !can(item.permission)) return null;
            if (item.group) {
              return !collapsed ? <div key={index} className={styles.navGroup}>{item.group}</div> : <div key={index} style={{height: 16}} />;
            }
            
            const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href || '');
            const Icon = item.icon!;
            
            return (
              <Link 
                key={index} 
                href={item.href!} 
                prefetch={true}
                className={styles.navItem + (isActive ? ' ' + styles.active : '')}
                title={collapsed ? item.name : undefined}
                onClick={() => mobileOpen && onMobileClose()}
              >
                <Icon className={styles.navIcon} size={20} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <button 
            onClick={onCollapse} 
            style={{background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)'}}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
}


