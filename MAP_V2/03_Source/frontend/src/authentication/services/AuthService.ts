import type {
  LoginCredentials,
  AuthResponse,
  MFAVerification,
  PasswordReset,
  PasswordChange,
  AuthConfig,
  AuthProvider,
} from '../types/auth.types';

const API_DELAY = 1000;

export const AuthService = {
  /**
   * Authenticate user with credentials
   * Placeholder - will integrate with backend/Entra ID
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));

    // Placeholder response
    return {
      user: {
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
        roles: ['user'],
        permissions: ['read', 'write'],
      },
      token: 'mock_jwt_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      expiresIn: 3600,
    };
  },

  /**
   * End user session
   */
  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },

  /**
   * Refresh authentication token
   */
  refresh: async (): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      user: {
        id: '1',
        email: 'user@example.com',
        name: 'User',
        roles: ['user'],
        permissions: ['read', 'write'],
      },
      token: 'mock_refreshed_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      expiresIn: 3600,
    };
  },

  /**
   * Send password reset email
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  forgotPassword: async (_email: string): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    return { message: 'Password reset email sent' };
  },

  /**
   * Reset password with token
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resetPassword: async (_data: PasswordReset): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    return { message: 'Password reset successful' };
  },

  /**
   * Verify MFA code
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  verifyMFA: async (_data: MFAVerification): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));

    return {
      user: {
        id: '1',
        email: 'user@example.com',
        name: 'User',
        roles: ['user'],
        permissions: ['read', 'write'],
      },
      token: 'mock_mfa_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      expiresIn: 3600,
    };
  },

  /**
   * Change user password
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changePassword: async (_data: PasswordChange): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    return { message: 'Password changed successfully' };
  },

  /**
   * Get authentication provider configuration
   */
  getProviderConfig: (provider: AuthProvider): AuthConfig => {
    const configs: Record<AuthProvider, AuthConfig> = {
      microsoft: {
        provider: 'microsoft',
        clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
        tenantId: import.meta.env.VITE_MICROSOFT_TENANT_ID || '',
        redirectUri: window.location.origin + '/auth/callback',
        scopes: ['User.Read'],
      },
      google: {
        provider: 'google',
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        redirectUri: window.location.origin + '/auth/callback',
        scopes: ['email', 'profile'],
      },
      github: {
        provider: 'github',
        clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
        redirectUri: window.location.origin + '/auth/callback',
        scopes: ['user:email'],
      },
      local: {
        provider: 'local',
      },
    };

    return configs[provider];
  },

  /**
   * Check if user has required role
   */
  hasRole: (userRoles: string[], requiredRole: string): boolean => {
    return userRoles.includes(requiredRole);
  },

  /**
   * Check if user has required permission
   */
  hasPermission: (userPermissions: string[], requiredPermission: string): boolean => {
    return userPermissions.includes(requiredPermission);
  },
};
