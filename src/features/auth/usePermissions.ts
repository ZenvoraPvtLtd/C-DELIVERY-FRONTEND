"use client";
import { useAuth } from './AuthContext';
import { Permission } from '@/types/auth';
import { useMemo } from 'react';

export function usePermissions() {
  const { user } = useAuth();

  const can = (permission: Permission) => {
    return user.permissions.includes(permission);
  };

  const canAny = (permissions: Permission[]) => {
    return permissions.some(p => user.permissions.includes(p));
  };

  const canAll = (permissions: Permission[]) => {
    return permissions.every(p => user.permissions.includes(p));
  };

  // We memoize the return object so it doesn't cause unnecessary re-renders if used in deps
  return useMemo(() => ({ can, canAny, canAll, user }), [user]);
}
