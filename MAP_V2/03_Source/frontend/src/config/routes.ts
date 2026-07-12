export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LOGOUT: '/logout',
  ACCESS_DENIED: '/access-denied',
  SESSION_EXPIRED: '/session-expired',
  FORGOT_PASSWORD: '/forgot-password',

  DASHBOARD: '/dashboard',
  EXECUTIVE_DASHBOARD: '/dashboard/executive',

  MIGRATION: '/migration',
  MIGRATION_OVERVIEW: '/migration/overview',
  MIGRATION_JOBS: '/migration/jobs',
  MIGRATION_HISTORY: '/migration/history',

  VALIDATION: '/validation',
  VALIDATION_RULES: '/validation/rules',
  VALIDATION_RESULTS: '/validation/results',
  VALIDATION_QUEUE: '/validation/queue',

  GOVERNANCE: '/governance',
  GOVERNANCE_POLICIES: '/governance/policies',
  GOVERNANCE_COMPLIANCE: '/governance/compliance',
  GOVERNANCE_AUDIT: '/governance/audit',

  RISK: '/risk',
  RISK_ASSESSMENT: '/risk/assessment',
  RISK_REGISTER: '/risk/register',
  RISK_MATRIX: '/risk/matrix',

  REPORTS: '/reports',
  REPORTS_STANDARD: '/reports/standard',
  REPORTS_CUSTOM: '/reports/custom',
  REPORTS_SCHEDULED: '/reports/scheduled',

  ADMINISTRATION: '/administration',
  ADMIN_USERS: '/administration/users',
  ADMIN_ROLES: '/administration/roles',
  ADMIN_SETTINGS: '/administration/settings',

  AI: '/ai',
  AI_ASSISTANT: '/ai/assistant',
  AI_INSIGHTS: '/ai/insights',
  AI_PROMPTS: '/ai/prompts',

  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_PREFERENCES: '/settings/preferences',

  HELP: '/help',
  HELP_DOCUMENTATION: '/help/documentation',
  HELP_SUPPORT: '/help/support',

  NOT_FOUND: '*',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
