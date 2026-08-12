"use client";
import React, { useEffect, useState } from 'react';
import { usePermissions } from './usePermissions';
import { Permission } from '@/types/auth';
import { Unauthorized } from './Unauthorized';

interface RouteGuardProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  children: React.ReactNode;
}

export function RouteGuard({ permission, permissions, requireAll = false, children }: RouteGuardProps) {
  const { can, canAny, canAll } = usePermissions();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch on initial render

  let hasAccess = false;

  if (permission) {
    hasAccess = can(permission);
  } else if (permissions) {
    hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
  } else {
    hasAccess = true;
  }

  if (!hasAccess) return <Unauthorized />;
  return <>{children}</>;
}
