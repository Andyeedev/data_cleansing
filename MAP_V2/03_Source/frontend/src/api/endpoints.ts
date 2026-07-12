export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    LIST: '/users',
    GET: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  MIGRATION: {
    JOBS: '/migration/jobs',
    JOB: (id: string) => `/migration/jobs/${id}`,
    START: (id: string) => `/migration/jobs/${id}/start`,
    STOP: (id: string) => `/migration/jobs/${id}/stop`,
    STATUS: (id: string) => `/migration/jobs/${id}/status`,
  },
  VALIDATION: {
    RULES: '/validation/rules',
    RULE: (id: string) => `/validation/rules/${id}`,
    RESULTS: '/validation/results',
    QUEUE: '/validation/queue',
  },
  GOVERNANCE: {
    POLICIES: '/governance/policies',
    COMPLIANCE: '/governance/compliance',
    AUDIT: '/governance/audit',
  },
  RISK: {
    ASSESSMENT: '/risk/assessment',
    REGISTER: '/risk/register',
    MATRIX: '/risk/matrix',
  },
  REPORTS: {
    STANDARD: '/reports/standard',
    CUSTOM: '/reports/custom',
    SCHEDULED: '/reports/scheduled',
    GENERATE: '/reports/generate',
  },
  AI: {
    CHAT: '/ai/chat',
    INSIGHTS: '/ai/insights',
    PROMPTS: '/ai/prompts',
  },
  ADMIN: {
    SETTINGS: '/admin/settings',
    ROLES: '/admin/roles',
  },
} as const;
