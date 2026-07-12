import {
  Home, LayoutDashboard, Database, BadgeCheck, ShieldCheck,
  TriangleAlert, BarChart3, Bot, Settings2, Cog, CircleHelp,
  FileText, Scale, ClipboardList, BookOpen, FileCheck, ListTodo,
  Users, Shield, MessageSquare, Lightbulb,
  Briefcase, History, FileBarChart, FilePlus, Clock,
  User, Sliders, Play, FolderTree, Map, RefreshCw, AlertTriangle, Activity, Layout, Key, Lock, FolderSearch, Calendar, Target
} from 'lucide-react';
import type { NavigationConfig, NavigationItem } from './navigation.types';

export const navigationSettings = {
  sidebarCollapsedWidth: '4rem',
  sidebarExpandedWidth: '16rem',
  headerHeight: '4rem',
  footerHeight: '4rem',
  mobileDrawerWidth: '280px',
};

const homeItem: NavigationItem = {
  id: 'home',
  label: 'Home',
  path: '/',
  icon: Home,
  description: 'Home page',
};

const dashboardItem: NavigationItem = {
  id: 'dashboard',
  label: 'Executive Dashboard',
  path: '/dashboard/executive',
  icon: LayoutDashboard,
  description: 'Executive dashboard and analytics',
};

const operationsItem: NavigationItem = {
  id: 'operations',
  label: 'Operations',
  path: '/operations',
  icon: Settings2,
  description: 'Operations workspace',
  children: [
    { id: 'ops-overview', label: 'Dashboard', path: '/operations/overview', icon: LayoutDashboard, description: 'Operations dashboard' },
    { id: 'ops-executions', label: 'Executions', path: '/operations/executions', icon: Play, description: 'Execution monitoring' },
    { id: 'ops-queues', label: 'Queues', path: '/operations/queues', icon: ListTodo, description: 'Queue management' },
    { id: 'ops-schedules', label: 'Schedules', path: '/operations/schedules', icon: Clock, description: 'Schedule manager' },
    { id: 'ops-monitoring', label: 'Monitoring', path: '/operations/monitoring', icon: Activity, description: 'System monitoring' },
    { id: 'ops-alerts', label: 'Alerts', path: '/operations/alerts', icon: AlertTriangle, description: 'Alert management' },
    { id: 'ops-retry', label: 'Retry Centre', path: '/operations/retry', icon: RefreshCw, description: 'Retry management' },
  ],
};

const migrationItem: NavigationItem = {
  id: 'migration',
  label: 'Migration',
  path: '/migration',
  icon: Database,
  description: 'Data migration management',
  children: [
    { id: 'migration-overview', label: 'Overview', path: '/migration/overview', icon: LayoutDashboard, description: 'Migration overview' },
    { id: 'migration-projects', label: 'Projects', path: '/migration/projects', icon: Briefcase, description: 'Migration projects' },
    { id: 'migration-execution', label: 'Execution', path: '/migration/execution', icon: Play, description: 'Migration execution' },
    { id: 'migration-datasets', label: 'Datasets', path: '/migration/datasets', icon: Database, description: 'Dataset management' },
    { id: 'migration-mappings', label: 'Mappings', path: '/migration/mappings', icon: Map, description: 'Mapping management' },
    { id: 'migration-schedules', label: 'Schedules', path: '/migration/schedules', icon: Clock, description: 'Migration schedules' },
    { id: 'migration-history', label: 'History', path: '/migration/history', icon: History, description: 'Migration history' },
    { id: 'migration-reports', label: 'Reports', path: '/migration/reports', icon: BarChart3, description: 'Migration reports' },
    { id: 'migration-workspace', label: 'Workspace', path: '/migration/workspace', icon: FolderTree, description: 'Migration workspace' },
  ],
};

const validationItem: NavigationItem = {
  id: 'validation',
  label: 'Validation',
  path: '/validation',
  icon: BadgeCheck,
  description: 'Data validation rules and results',
  children: [
    { id: 'validation-rules', label: 'Rules', path: '/validation/rules', icon: BookOpen, description: 'Validation rules' },
    { id: 'validation-results', label: 'Results', path: '/validation/results', icon: FileCheck, description: 'Validation results' },
    { id: 'validation-queue', label: 'Queue', path: '/validation/queue', icon: ListTodo, description: 'Validation queue' },
  ],
};

const governanceItem: NavigationItem = {
  id: 'governance',
  label: 'Governance',
  path: '/governance',
  icon: ShieldCheck,
  description: 'Governance, compliance and audit management',
  children: [
    { id: 'governance-overview', label: 'Overview', path: '/governance/overview', icon: LayoutDashboard, description: 'Governance overview' },
    { id: 'governance-compliance', label: 'Compliance', path: '/governance/compliance', icon: ShieldCheck, description: 'Compliance monitoring' },
    { id: 'governance-policies', label: 'Policies', path: '/governance/policies', icon: FileText, description: 'Policy management' },
    { id: 'governance-controls', label: 'Controls', path: '/governance/controls', icon: Settings2, description: 'Control effectiveness' },
    { id: 'governance-exceptions', label: 'Exceptions', path: '/governance/exceptions', icon: AlertTriangle, description: 'Exception management' },
    { id: 'governance-risk', label: 'Risk Governance', path: '/governance/risk', icon: Scale, description: 'Risk governance' },
    { id: 'governance-audit', label: 'Audit Centre', path: '/governance/audit', icon: ClipboardList, description: 'Audit management' },
    { id: 'governance-reports', label: 'Regulatory Reporting', path: '/governance/reports', icon: BarChart3, description: 'Regulatory reports' },
    { id: 'governance-workspace', label: 'Workspace', path: '/governance/workspace', icon: Layout, description: 'Governance workspace' },
  ],
};

const riskItem: NavigationItem = {
  id: 'risk',
  label: 'Risk',
  path: '/risk',
  icon: TriangleAlert,
  description: 'Risk assessment and management',
  children: [
    { id: 'risk-assessment', label: 'Assessment', path: '/risk/assessment', icon: TriangleAlert, description: 'Risk assessment' },
    { id: 'risk-register', label: 'Register', path: '/risk/register', icon: BookOpen, description: 'Risk register' },
    { id: 'risk-matrix', label: 'Matrix', path: '/risk/matrix', icon: LayoutDashboard, description: 'Risk matrix' },
  ],
};

const reportsItem: NavigationItem = {
  id: 'reports',
  label: 'Reports',
  path: '/reports',
  icon: BarChart3,
  description: 'Report generation and management',
  children: [
    { id: 'reports-overview', label: 'Overview', path: '/reports/overview', icon: LayoutDashboard, description: 'Reporting overview' },
    { id: 'reports-executive', label: 'Executive Reports', path: '/reports/executive', icon: FileBarChart, description: 'Executive reports' },
    { id: 'reports-operational', label: 'Operational Reports', path: '/reports/operational', icon: FileBarChart, description: 'Operational reports' },
    { id: 'reports-migration', label: 'Migration Reports', path: '/reports/migration', icon: FileBarChart, description: 'Migration reports' },
    { id: 'reports-validation', label: 'Validation Reports', path: '/reports/validation', icon: FileBarChart, description: 'Validation reports' },
    { id: 'reports-governance', label: 'Governance Reports', path: '/reports/governance', icon: FileBarChart, description: 'Governance reports' },
    { id: 'reports-audit', label: 'Audit Reports', path: '/reports/audit', icon: FileBarChart, description: 'Audit reports' },
    { id: 'reports-regulatory', label: 'Regulatory Reports', path: '/reports/regulatory', icon: FileBarChart, description: 'Regulatory reports' },
    { id: 'reports-scheduled', label: 'Scheduled Reports', path: '/reports/scheduled', icon: Clock, description: 'Scheduled reports' },
    { id: 'reports-templates', label: 'Templates', path: '/reports/templates', icon: FileText, description: 'Report templates' },
    { id: 'reports-distribution', label: 'Distribution', path: '/reports/distribution', icon: FilePlus, description: 'Report distribution' },
    { id: 'reports-workspace', label: 'Workspace', path: '/reports/workspace', icon: Layout, description: 'Reporting workspace' },
  ],
};

const reportCentreItem: NavigationItem = {
  id: 'report-centre',
  label: 'Report Centre',
  path: '/report-centre',
  icon: FolderSearch,
  description: 'Browse, preview and manage reports',
  children: [
    { id: 'rc-home', label: 'Home', path: '/report-centre', icon: Home, description: 'Report Centre home' },
    { id: 'rc-explorer', label: 'Explorer', path: '/report-centre/explorer', icon: FolderSearch, description: 'Report explorer' },
    { id: 'rc-recent', label: 'Recent', path: '/report-centre/recent', icon: Clock, description: 'Recent reports' },
    { id: 'rc-favourites', label: 'Favourites', path: '/report-centre/favourites', icon: FileText, description: 'Favourite reports' },
    { id: 'rc-scheduled', label: 'Scheduled', path: '/report-centre/scheduled', icon: Clock, description: 'Scheduled reports' },
    { id: 'rc-templates', label: 'Templates', path: '/report-centre/templates', icon: FileText, description: 'Report templates' },
    { id: 'rc-workspace', label: 'Workspace', path: '/report-centre/workspace', icon: Layout, description: 'Report workspace' },
  ],
};

const schedulerItem: NavigationItem = {
  id: 'scheduler',
  label: 'Report Scheduler',
  path: '/scheduler',
  icon: Clock,
  description: 'Schedule and automate report generation',
  children: [
    { id: 'sched-dashboard', label: 'Dashboard', path: '/scheduler', icon: LayoutDashboard, description: 'Scheduler dashboard' },
    { id: 'sched-schedules', label: 'Schedules', path: '/scheduler/schedules', icon: Clock, description: 'Schedule explorer' },
    { id: 'sched-calendar', label: 'Calendar', path: '/scheduler/calendar', icon: Calendar, description: 'Schedule calendar' },
    { id: 'sched-timeline', label: 'Timeline', path: '/scheduler/timeline', icon: History, description: 'Schedule timeline' },
    { id: 'sched-queue', label: 'Queue', path: '/scheduler/queue', icon: ListTodo, description: 'Queue manager' },
    { id: 'sched-history', label: 'History', path: '/scheduler/history', icon: History, description: 'Schedule history' },
    { id: 'sched-templates', label: 'Templates', path: '/scheduler/templates', icon: FileText, description: 'Schedule templates' },
    { id: 'sched-notifications', label: 'Notifications', path: '/scheduler/notifications', icon: AlertTriangle, description: 'Notification settings' },
    { id: 'sched-logs', label: 'Logs', path: '/scheduler/logs', icon: FileText, description: 'Scheduler logs' },
    { id: 'sched-statistics', label: 'Statistics', path: '/scheduler/statistics', icon: BarChart3, description: 'Scheduler statistics' },
    { id: 'sched-settings', label: 'Settings', path: '/scheduler/settings', icon: Settings2, description: 'Scheduler settings' },
  ],
};

const distributionItem: NavigationItem = {
  id: 'distribution',
  label: 'Report Distribution',
  path: '/distribution',
  icon: FilePlus,
  description: 'Manage report delivery across enterprise channels',
  children: [
    { id: 'dist-dashboard', label: 'Dashboard', path: '/distribution', icon: LayoutDashboard, description: 'Distribution dashboard' },
    { id: 'dist-explorer', label: 'Explorer', path: '/distribution/explorer', icon: FolderSearch, description: 'Distribution explorer' },
    { id: 'dist-queue', label: 'Queue', path: '/distribution/queue', icon: ListTodo, description: 'Distribution queue' },
    { id: 'dist-history', label: 'History', path: '/distribution/history', icon: History, description: 'Distribution history' },
    { id: 'dist-channels', label: 'Channels', path: '/distribution/channels', icon: Settings2, description: 'Delivery channels' },
    { id: 'dist-profiles', label: 'Profiles', path: '/distribution/profiles', icon: Users, description: 'Distribution profiles' },
    { id: 'dist-templates', label: 'Templates', path: '/distribution/templates', icon: FileText, description: 'Distribution templates' },
    { id: 'dist-notifications', label: 'Notifications', path: '/distribution/notifications', icon: AlertTriangle, description: 'Distribution notifications' },
    { id: 'dist-audit', label: 'Audit', path: '/distribution/audit', icon: ClipboardList, description: 'Distribution audit' },
    { id: 'dist-logs', label: 'Logs', path: '/distribution/logs', icon: FileText, description: 'Distribution logs' },
    { id: 'dist-statistics', label: 'Statistics', path: '/distribution/statistics', icon: BarChart3, description: 'Distribution statistics' },
    { id: 'dist-workspace', label: 'Workspace', path: '/distribution/workspace', icon: Layout, description: 'Distribution workspace' },
    { id: 'dist-settings', label: 'Settings', path: '/distribution/settings', icon: Settings2, description: 'Distribution settings' },
  ],
};

const aiItem: NavigationItem = {
  id: 'ai',
  label: 'AI Platform',
  path: '/ai',
  icon: Bot,
  description: 'AI-powered assistance',
  children: [
    { id: 'ai-assistant', label: 'Assistant', path: '/ai/assistant', icon: MessageSquare, description: 'AI assistant chat' },
    { id: 'ai-insights', label: 'Insights', path: '/ai/insights', icon: Lightbulb, description: 'AI insights' },
    { id: 'ai-recommendations', label: 'Recommendations', path: '/ai/recommendations', icon: Target, description: 'AI recommendations' },
    { id: 'ai-report-generator', label: 'Report Generator', path: '/ai/report-generator', icon: FileText, description: 'AI report generator' },
  ],
};

const adminItem: NavigationItem = {
  id: 'administration',
  label: 'Administration',
  path: '/administration',
  icon: Users,
  description: 'System administration',
  children: [
    { id: 'admin-overview', label: 'Overview', path: '/administration/overview', icon: LayoutDashboard, description: 'Administration overview' },
    { id: 'admin-tenants', label: 'Tenants', path: '/administration/tenants', icon: Users, description: 'Tenant management' },
    { id: 'admin-organisations', label: 'Organisations', path: '/administration/organisations', icon: Users, description: 'Organisation management' },
    { id: 'admin-users', label: 'Users', path: '/administration/users', icon: Users, description: 'User management' },
    { id: 'admin-roles', label: 'Roles', path: '/administration/roles', icon: Shield, description: 'Role management' },
    { id: 'admin-permissions', label: 'Permissions', path: '/administration/permissions', icon: Key, description: 'Permission management' },
    { id: 'admin-subscriptions', label: 'Subscriptions', path: '/administration/subscriptions', icon: Users, description: 'Subscription management' },
    { id: 'admin-licensing', label: 'Licensing', path: '/administration/licensing', icon: Users, description: 'Licence management' },
    { id: 'admin-configuration', label: 'Platform Configuration', path: '/administration/configuration', icon: Settings2, description: 'Platform configuration' },
    { id: 'admin-feature-flags', label: 'Feature Flags', path: '/administration/feature-flags', icon: Users, description: 'Feature flags' },
    { id: 'admin-system-settings', label: 'System Settings', path: '/administration/system-settings', icon: Cog, description: 'System settings' },
    { id: 'admin-scheduler', label: 'Scheduler', path: '/administration/scheduler', icon: Users, description: 'Job scheduler' },
    { id: 'admin-notifications', label: 'Notifications', path: '/administration/notifications', icon: Users, description: 'Notification management' },
    { id: 'admin-environment', label: 'Environment', path: '/administration/environment', icon: Users, description: 'Environment management' },
    { id: 'admin-maintenance', label: 'Maintenance', path: '/administration/maintenance', icon: Users, description: 'Maintenance centre' },
    { id: 'admin-health', label: 'Platform Health', path: '/administration/health', icon: Users, description: 'Health monitoring' },
    { id: 'admin-dashboard', label: 'Administration Dashboard', path: '/administration/dashboard', icon: LayoutDashboard, description: 'Administration dashboard' },
  ],
};

const settingsItem: NavigationItem = {
  id: 'settings',
  label: 'Settings',
  path: '/settings',
  icon: Cog,
  description: 'User settings',
  children: [
    { id: 'settings-profile', label: 'Profile', path: '/settings/profile', icon: User, description: 'User profile' },
    { id: 'settings-preferences', label: 'Preferences', path: '/settings/preferences', icon: Sliders, description: 'User preferences' },
  ],
};

const helpItem: NavigationItem = {
  id: 'help',
  label: 'Help',
  path: '/help',
  icon: CircleHelp,
  description: 'Help and support',
  children: [
    { id: 'help-documentation', label: 'Documentation', path: '/help/documentation', icon: BookOpen, description: 'Documentation' },
    { id: 'help-support', label: 'Support', path: '/help/support', icon: MessageSquare, description: 'Support' },
  ],
};

const securityItem: NavigationItem = {
  id: 'security',
  label: 'Security',
  path: '/security',
  icon: Shield,
  description: 'Security monitoring and management',
  children: [
    { id: 'security-overview', label: 'Overview', path: '/security/overview', icon: LayoutDashboard, description: 'Security overview' },
    { id: 'security-credentials', label: 'Credentials', path: '/security/credentials', icon: Key, description: 'Credential management' },
    { id: 'security-encryption', label: 'Encryption', path: '/security/encryption', icon: Lock, description: 'Encryption management' },
    { id: 'security-keys', label: 'Keys', path: '/security/keys', icon: Key, description: 'Key management' },
    { id: 'security-certificates', label: 'Certificates', path: '/security/certificates', icon: FileCheck, description: 'Certificate management' },
    { id: 'security-identity', label: 'Identity Providers', path: '/security/identity-providers', icon: Users, description: 'Identity providers' },
    { id: 'security-auth', label: 'Authentication', path: '/security/authentication', icon: Shield, description: 'Authentication policies' },
    { id: 'security-mfa', label: 'MFA', path: '/security/mfa', icon: Shield, description: 'Multi-factor authentication' },
    { id: 'security-sessions', label: 'Sessions', path: '/security/sessions', icon: Shield, description: 'Session management' },
    { id: 'security-api', label: 'API Security', path: '/security/api-security', icon: Shield, description: 'API security' },
    { id: 'security-audit', label: 'Audit Logs', path: '/security/audit-logs', icon: Shield, description: 'Audit logs' },
    { id: 'security-events', label: 'Security Events', path: '/security/security-events', icon: Shield, description: 'Security events' },
    { id: 'security-threats', label: 'Threat Monitoring', path: '/security/threat-monitoring', icon: Shield, description: 'Threat monitoring' },
    { id: 'security-compliance', label: 'Compliance', path: '/security/compliance', icon: Shield, description: 'Compliance status' },
    { id: 'security-dashboard', label: 'Security Dashboard', path: '/security/dashboard', icon: LayoutDashboard, description: 'Security dashboard' },
  ],
};

export const navigationConfig: NavigationConfig = {
  sections: [
    {
      id: 'main',
      items: [
        homeItem,
        dashboardItem,
      ],
    },
    {
      id: 'portals',
      label: 'Portals',
      items: [
        operationsItem,
        migrationItem,
      ],
    },
    {
      id: 'operations',
      label: 'Operations',
      items: [
        validationItem,
        governanceItem,
        riskItem,
        reportsItem,
        reportCentreItem,
        schedulerItem,
        distributionItem,
      ],
    },
    {
      id: 'system',
      label: 'System',
      items: [
        securityItem,
        aiItem,
        adminItem,
        settingsItem,
        helpItem,
      ],
    },
  ],
  settings: navigationSettings,
};

export const flatNavigationItems: NavigationItem[] = [
  homeItem,
  dashboardItem,
  operationsItem,
  migrationItem,
  validationItem,
  governanceItem,
  riskItem,
  reportsItem,
  reportCentreItem,
  schedulerItem,
  distributionItem,
  securityItem,
  aiItem,
  adminItem,
  settingsItem,
  helpItem,
];

export const findNavigationItemByPath = (path: string): NavigationItem | undefined => {
  for (const item of flatNavigationItems) {
    if (item.path === path) return item;
    if (item.children) {
      const child = item.children.find((c) => c.path === path);
      if (child) return child;
    }
  }
  return undefined;
};

export const getParentItem = (path: string): NavigationItem | undefined => {
  for (const item of flatNavigationItems) {
    if (item.children) {
      const child = item.children.find((c) => c.path === path);
      if (child) return item;
    }
  }
  return undefined;
};
