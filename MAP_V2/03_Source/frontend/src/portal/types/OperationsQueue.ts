export interface OperationsQueueItem {
  id: string;
  name: string;
  type: 'execution' | 'retry' | 'pending' | 'scheduled' | 'priority';
  status: 'queued' | 'running' | 'completed' | 'failed' | 'paused' | 'waiting';
  priority: 'high' | 'medium' | 'low';
  dataset?: string;
  project?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  duration?: string;
  error?: string;
}

export interface OperationsAlert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'timeout' | 'dependency' | 'validation' | 'infrastructure';
  title: string;
  message: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
  acknowledged: boolean;
  source?: string;
}

export interface OperationsSchedule {
  id: string;
  name: string;
  cron?: string;
  nextRun: string;
  lastRun?: string;
  status: 'active' | 'paused' | 'completed' | 'failed' | 'cancelled';
  type: 'recurring' | 'one-time';
  dataset?: string;
}

export interface OperationsActivityItem {
  id: string;
  type: 'execution' | 'report' | 'dataset' | 'rule' | 'notification';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}

export interface OperationsSystemHealth {
  component: string;
  status: 'healthy' | 'degraded' | 'down';
  latency?: string;
  uptime?: string;
  lastChecked: string;
}
