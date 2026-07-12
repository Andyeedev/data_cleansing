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
      const token = localStorage.getItem('map_nexus_token') || sessionStorage.getItem('map_nexus_token');
      const userStr = localStorage.getItem('map_nexus_user') || sessionStorage.getItem('map_nexus_user');

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
          localStorage.removeItem('map_nexus_token');
          localStorage.removeItem('map_nexus_user');
          sessionStorage.removeItem('map_nexus_token');
          sessionStorage.removeItem('map_nexus_user');
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

    // Placeholder - no actual authentication
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: '1',
      email: credentials.email,
      name: credentials.email.split('@')[0],
      roles: ['user'],
      permissions: ['read', 'write'],
    };

    const mockToken = 'mock_jwt_token_' + Date.now();

    if (credentials.rememberMe) {
      localStorage.setItem('map_nexus_token', mockToken);
      localStorage.setItem('map_nexus_user', JSON.stringify(mockUser));
    } else {
      sessionStorage.setItem('map_nexus_token', mockToken);
      sessionStorage.setItem('map_nexus_user', JSON.stringify(mockUser));
    }

    setState({
      user: mockUser,
      token: mockToken,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    // Placeholder - no actual logout
    await new Promise((resolve) => setTimeout(resolve, 500));

    localStorage.removeItem('map_nexus_token');
    localStorage.removeItem('map_nexus_user');
    sessionStorage.removeItem('map_nexus_token');
    sessionStorage.removeItem('map_nexus_user');

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
