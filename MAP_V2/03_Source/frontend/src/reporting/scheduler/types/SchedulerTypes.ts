export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'event-driven' | 'on-demand';

export type ScheduleStatus = 'active' | 'paused' | 'completed' | 'failed';

export type SchedulePriority = 'low' | 'medium' | 'high' | 'critical';

export type QueueStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export type LogLevel = 'info' | 'warning' | 'error' | 'debug';

export interface NotificationConfig {
  email: boolean;
  teams: boolean;
  sms: boolean;
  web: boolean;
}

export interface ScheduleConfig {
  id: string;
  reportId: string;
  reportName: string;
  frequency: ScheduleFrequency;
  startDate: string;
  endDate?: string;
  lastRun?: string;
  nextRun?: string;
  time: string;
  timeZone: string;
  priority: SchedulePriority;
  owner: string;
  status: ScheduleStatus;
  recipients: string[];
  notifications: NotificationConfig;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleTemplate {
  id: string;
  name: string;
  description: string;
  frequency: ScheduleFrequency;
  priority: SchedulePriority;
  config: Partial<ScheduleConfig>;
  usageCount: number;
}

export interface ScheduleLogEntry {
  id: string;
  scheduleId: string;
  scheduleName: string;
  level: LogLevel;
  message: string;
  timestamp: string;
}

export interface SchedulerMetrics {
  totalScheduled: number;
  runningJobs: number;
  nextExecutions: number;
  failedSchedules: number;
  queueSize: number;
  healthScore: number;
  successRate: number;
  failureRate: number;
  averageRuntime: number;
  peakHours: string;
}

export interface SchedulerFilters {
  search: string;
  frequency: ScheduleFrequency | 'all';
  status: ScheduleStatus | 'all';
  priority: SchedulePriority | 'all';
  owner: string;
}
