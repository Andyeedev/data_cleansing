export const environment = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  apiVersion: import.meta.env.VITE_API_VERSION || 'v1',
  appName: import.meta.env.VITE_APP_NAME || 'MAP Nexus',
  appVersion: import.meta.env.VITE_APP_VERSION || '2.0.0',
  authRedirectUri: import.meta.env.VITE_AUTH_REDIRECT_URI || 'http://localhost:5173/auth/callback',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  enableDebugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
};

export const getApiUrl = (endpoint: string): string => {
  return `${environment.apiBaseUrl}/api/${environment.apiVersion}${endpoint}`;
};
