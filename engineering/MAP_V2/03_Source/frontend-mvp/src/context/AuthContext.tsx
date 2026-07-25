import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { MockRole, MockUser } from '../types/auth';
import { MOCK_USERS } from '../types/auth';

interface AuthContextValue {
  user: MockUser;
  userRoles: string[];
  switchRole: (role: MockRole) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  initialRole?: MockRole;
  children: ReactNode;
}

export function AuthProvider({ initialRole = 'viewer', children }: AuthProviderProps) {
  const [currentRole, setCurrentRole] = useState<MockRole>(initialRole);

  const user = MOCK_USERS[currentRole];
  const userRoles = user.roles;

  const switchRole = useCallback((role: MockRole) => {
    setCurrentRole(role);
  }, []);

  return (
    <AuthContext.Provider value={{ user, userRoles, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
