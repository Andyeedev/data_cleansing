import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, LoginCredentials, AuthState, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getInitialAuthState(): AuthState {
  try {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('map_nexus_user');
    if (token && userStr) {
      const payload = decodeJwtPayload(token);
      if (payload?.exp) {
        const expiresAt = (payload.exp as number) * 1000;
        if (Date.now() >= expiresAt) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('map_nexus_user');
          return { user: null, token: null, isAuthenticated: false, isLoading: false };
        }
      }
      const user = JSON.parse(userStr);
      if (payload?.tenant_id && !user.tenantId) {
        user.tenantId = payload.tenant_id as string;
        localStorage.setItem('map_nexus_user', JSON.stringify(user));
      }
      return { user, token, isAuthenticated: true, isLoading: false };
    }
  } catch {
    localStorage.removeItem('access_token');
    localStorage.removeItem('map_nexus_user');
  }
  return { user: null, token: null, isAuthenticated: false, isLoading: false };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(getInitialAuthState);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: credentials.email, password: credentials.password }),
    });

    if (!response.ok) {
      const text = await response.text();
      let message = `Login failed (${response.status})`;
      try {
        const json = JSON.parse(text);
        message = json.detail || json.message || message;
      } catch {}
      setState((prev) => ({ ...prev, isLoading: false }));
      throw new Error(message);
    }

    const { access_token } = await response.json();

    const payload = decodeJwtPayload(access_token);
    const user: User = {
      id: '1',
      email: credentials.email,
      name: credentials.email.split('@')[0],
      roles: ['admin'],
      permissions: ['read', 'write', 'delete', 'admin'],
      tenantId: (payload?.tenant_id as string) || undefined,
    };

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('map_nexus_user', JSON.stringify(user));

    setState({ user, token: access_token, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    localStorage.removeItem('access_token');
    localStorage.removeItem('map_nexus_user');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  const switchRole = useCallback((role: string) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, roles: [role] };
      localStorage.setItem('map_nexus_user', JSON.stringify(updatedUser));
      return { ...prev, user: updatedUser };
    });
  }, []);

  const userRoles = state.user?.roles ?? [];
  const tenantId = state.user?.tenantId;

  return (
    <AuthContext.Provider value={{ ...state, userRoles, tenantId, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/** role → report‑pack permission map */
export const packPermissions: Record<string, string[]> = {
  admin:     ['operational', 'migration', 'validation', 'governance', 'audit'],
  manager:   ['migration', 'validation', 'governance'],
  operator:  ['validation'],
  viewer:    [],
};

/** Hook: does the current user see the given pack? */
export function usePackPermission(pack: string): boolean {
  const { userRoles } = useAuth();
  const userRole = userRoles[0] ?? 'viewer';
  return packPermissions[userRole]?.includes(pack) ?? false;
}
