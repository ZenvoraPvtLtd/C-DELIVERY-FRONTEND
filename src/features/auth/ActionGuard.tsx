"use client";
import React from 'react';
import { usePermissions } from './usePermissions';
import { Permission } from '@/types/auth';

interface ActionGuardProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ActionGuard({ permission, permissions, requireAll = false, children, fallback = null }: ActionGuardProps) {
  const { can, canAny, canAll } = usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = can(permission);
  } else if (permissions) {
    hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
  } else {
    hasAccess = true;
  }

  if (!hasAccess) return <>{fallback}</>;
  return <>{children}</>;
}
