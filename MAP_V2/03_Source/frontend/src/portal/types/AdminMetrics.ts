export interface AdminTenant {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'provisioning' | 'decommissioned';
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  users: number;
  createdAt: string;
  lastActivity: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'locked' | 'pending';
  roles: string[];
  lastLogin: string;
  createdAt: string;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  users: number;
  permissions: number;
  isSystem: boolean;
}

export interface AdminJob {
  id: string;
  name: string;
  status: 'running' | 'queued' | 'completed' | 'failed' | 'retry';
  schedule: string;
  lastRun: string;
  nextRun: string;
}

export interface AdminMetrics {
  activeUsers: number;
  activeTenants: number;
  organisations: number;
  activeSessions: number;
  scheduledJobs: number;
  platformHealth: number;
  licenceUsage: number;
  featureStatus: number;
  systemAlerts: string;
  healthTrend: number[];
  userTrend: number[];
  tenantTrend: number[];
}
