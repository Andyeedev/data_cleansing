import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  children?: NavItem[];
}

export const mainNavigation: NavItem[] = [
  {
    label: 'Home',
    path: ROUTES.HOME,
    icon: 'Home',
  },
  {
    label: 'Executive Dashboard',
    path: ROUTES.EXECUTIVE_DASHBOARD,
    icon: 'LayoutDashboard',
  },
  {
    label: 'Migration',
    path: ROUTES.MIGRATION,
    icon: 'ArrowRightLeft',
    children: [
      { label: 'Overview', path: ROUTES.MIGRATION_OVERVIEW, icon: 'Eye' },
      { label: 'Jobs', path: ROUTES.MIGRATION_JOBS, icon: 'Briefcase' },
      { label: 'History', path: ROUTES.MIGRATION_HISTORY, icon: 'History' },
    ],
  },
  {
    label: 'Validation',
    path: ROUTES.VALIDATION,
    icon: 'CheckCircle',
    children: [
      { label: 'Rules', path: ROUTES.VALIDATION_RULES, icon: 'BookOpen' },
      { label: 'Results', path: ROUTES.VALIDATION_RESULTS, icon: 'FileCheck' },
      { label: 'Queue', path: ROUTES.VALIDATION_QUEUE, icon: 'ListTodo' },
    ],
  },
  {
    label: 'Governance',
    path: ROUTES.GOVERNANCE,
    icon: 'Shield',
    children: [
      { label: 'Policies', path: ROUTES.GOVERNANCE_POLICIES, icon: 'FileText' },
      { label: 'Compliance', path: ROUTES.GOVERNANCE_COMPLIANCE, icon: 'Scale' },
      { label: 'Audit', path: ROUTES.GOVERNANCE_AUDIT, icon: 'ClipboardList' },
    ],
  },
  {
    label: 'Risk',
    path: ROUTES.RISK,
    icon: 'AlertTriangle',
    children: [
      { label: 'Assessment', path: ROUTES.RISK_ASSESSMENT, icon: 'Assessment' },
      { label: 'Register', path: ROUTES.RISK_REGISTER, icon: 'BookOpen' },
      { label: 'Matrix', path: ROUTES.RISK_MATRIX, icon: 'Grid' },
    ],
  },
  {
    label: 'Reports',
    path: ROUTES.REPORTS,
    icon: 'BarChart3',
    children: [
      { label: 'Standard', path: ROUTES.REPORTS_STANDARD, icon: 'FileBarChart' },
      { label: 'Custom', path: ROUTES.REPORTS_CUSTOM, icon: 'FilePlus' },
      { label: 'Scheduled', path: ROUTES.REPORTS_SCHEDULED, icon: 'Clock' },
    ],
  },
  {
    label: 'Administration',
    path: ROUTES.ADMINISTRATION,
    icon: 'Settings',
    children: [
      { label: 'Users', path: ROUTES.ADMIN_USERS, icon: 'Users' },
      { label: 'Roles', path: ROUTES.ADMIN_ROLES, icon: 'ShieldCheck' },
      { label: 'Settings', path: ROUTES.ADMIN_SETTINGS, icon: 'Sliders' },
    ],
  },
  {
    label: 'AI Assistant',
    path: ROUTES.AI,
    icon: 'Bot',
    children: [
      { label: 'Assistant', path: ROUTES.AI_ASSISTANT, icon: 'MessageSquare' },
      { label: 'Insights', path: ROUTES.AI_INSIGHTS, icon: 'Lightbulb' },
      { label: 'Prompts', path: ROUTES.AI_PROMPTS, icon: 'Terminal' },
    ],
  },
  {
    label: 'Settings',
    path: ROUTES.SETTINGS,
    icon: 'Cog',
    children: [
      { label: 'Profile', path: ROUTES.SETTINGS_PROFILE, icon: 'User' },
      { label: 'Preferences', path: ROUTES.SETTINGS_PREFERENCES, icon: 'Sliders' },
    ],
  },
  {
    label: 'Help',
    path: ROUTES.HELP,
    icon: 'HelpCircle',
    children: [
      { label: 'Documentation', path: ROUTES.HELP_DOCUMENTATION, icon: 'Book' },
      { label: 'Support', path: ROUTES.HELP_SUPPORT, icon: 'Headphones' },
    ],
  },
];

export const footerNavigation = [
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'Contact Support', path: '/support' },
];
