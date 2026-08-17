"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CurrentUser, Role, Permission } from '@/types/auth';
import { ROLE_PERMISSIONS } from '@/config/permissions';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from './authService';

interface AuthContextType {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
}

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
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('c_delivery_access_token');
        if (token) {
          const currentUser = await authService.getMe();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('c_delivery_access_token');
        localStorage.removeItem('c_delivery_refresh_token');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('c_delivery_access_token', response.accessToken);
      localStorage.setItem('c_delivery_refresh_token', response.refreshToken);
      document.cookie = 'c_delivery_auth=true; path=/; max-age=86400'; // 1 day
      
      setUser(response.user);
      router.push('/delivery');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('c_delivery_access_token');
    localStorage.removeItem('c_delivery_refresh_token');
    
    // Clear the legacy mock cookie just in case it's still hanging around
    document.cookie = "c_delivery_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    
    setUser(null);
    router.push('/login');
  };

  const switchRole = (newRole: Role) => {
    // Only used for mock/demo purposes to fast-switch UI.
    // In a real app with real auth, we'd need to re-login or request a token upgrade.
    // We'll leave the state update here so the UI can still show different states if needed.
    if (!user) return;
    setUser({
      ...user,
      userId: `USR-${newRole}`,
      name: `Demo ${newRole.replace(/_/g, ' ')}`,
      role: newRole,
      permissions: ROLE_PERMISSIONS[newRole] || []
    });
  };

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
