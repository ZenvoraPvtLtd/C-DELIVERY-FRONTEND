"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CurrentUser, Role, Permission } from '@/types/auth';
import { ROLE_PERMISSIONS } from '@/config/permissions';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const defaultUser: CurrentUser = {
  userId: 'USR-SUPERADMIN',
  name: 'Demo Admin',
  role: 'SUPER_ADMIN',
  permissions: ROLE_PERMISSIONS['SUPER_ADMIN']
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  switchRole: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for cookie
    const hasAuthCookie = document.cookie.includes('c_delivery_auth=true');
    if (hasAuthCookie) {
      setUser(defaultUser);
    }
    setIsInitializing(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Demo validation
    if (email === 'admin@cdelivery.demo' && password === 'Demo@123456') {
      document.cookie = "c_delivery_auth=true; path=/; max-age=86400";
      setUser(defaultUser);
      router.push('/delivery');
      return true;
    }
    return false;
  };

  const logout = () => {
    document.cookie = "c_delivery_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    setUser(null);
    router.push('/login');
  };

  const switchRole = (newRole: Role) => {
    if (!user) return;
    setUser({
      ...user,
      userId: `USR-${newRole}`,
      name: `Demo ${newRole.replace(/_/g, ' ')}`,
      role: newRole,
      permissions: ROLE_PERMISSIONS[newRole] || []
    });
  };

  // Skip rendering the children while checking auth state so we don't flash content.
  // Exception for login page.
  if (isInitializing && pathname !== '/login') {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
