export const APP_NAME = 'MAP Nexus';
export const APP_VERSION = '2.0.0';
export const APP_DESCRIPTION = 'Enterprise Financial Services Migration & Validation Platform';

export const API_TIMEOUT = 30000;
export const DEBOUNCE_DELAY = 300;
export const PAGINATION_DEFAULT_PAGE = 1;
export const PAGINATION_DEFAULT_SIZE = 25;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'map_nexus_auth_token',
  REFRESH_TOKEN: 'map_nexus_refresh_token',
  USER_PREFERENCES: 'map_nexus_user_preferences',
  THEME: 'map_nexus_theme',
} as const;

export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd MMMM yyyy',
  DATETIME: 'dd/MM/yyyy HH:mm',
  DATETIME_SECONDS: 'dd/MM/yyyy HH:mm:ss',
} as const;

export const ROLE_PERMISSIONS = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  ANALYST: 'analyst',
  VIEWER: 'viewer',
} as const;
