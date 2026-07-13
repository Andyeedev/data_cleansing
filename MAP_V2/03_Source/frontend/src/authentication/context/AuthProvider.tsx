import { useState, useCallback, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import type { User, LoginCredentials, AuthState } from '../types/auth.types';

interface AuthProviderProps {
  children: React.ReactNode;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      const userStr = localStorage.getItem('map_nexus_user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('map_nexus_user');
          setState({ ...initialState, isLoading: false });
        }
      } else {
        setState({ ...initialState, isLoading: false });
      }
    };

    checkAuth();
  }, []);

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

    const user: User = {
      id: '1',
      email: credentials.email,
      name: credentials.email.split('@')[0],
      roles: ['admin'],
      permissions: ['read', 'write', 'delete', 'admin'],
    };

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('map_nexus_user', JSON.stringify(user));

    setState({
      user,
      token: access_token,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    // Placeholder - no actual logout
    await new Promise((resolve) => setTimeout(resolve, 500));

    localStorage.removeItem('access_token');
    localStorage.removeItem('map_nexus_user');

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const refreshToken = useCallback(async () => {
    // Placeholder for token refresh
    await new Promise((resolve) => setTimeout(resolve, 500));
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, ...userData };
      localStorage.setItem('map_nexus_user', JSON.stringify(updatedUser));
      return { ...prev, user: updatedUser };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        refreshToken,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
