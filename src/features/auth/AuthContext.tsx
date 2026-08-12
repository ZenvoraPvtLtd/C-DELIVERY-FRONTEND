"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CurrentUser, Role, Permission } from '@/types/auth';
import { ROLE_PERMISSIONS } from '@/config/permissions';

interface AuthContextType {
  user: CurrentUser;
  switchRole: (role: Role) => void;
}

const defaultUser: CurrentUser = {
  userId: 'USR-SUPERADMIN',
  name: 'Demo Admin',
  role: 'SUPER_ADMIN',
  permissions: ROLE_PERMISSIONS['SUPER_ADMIN']
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  switchRole: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CurrentUser>(defaultUser);

  const switchRole = (newRole: Role) => {
    setUser({
      userId: `USR-${newRole}`,
      name: `Demo ${newRole.replace(/_/g, ' ')}`,
      role: newRole,
      permissions: ROLE_PERMISSIONS[newRole] || []
    });
  };

  return (
    <AuthContext.Provider value={{ user, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
