import { LayoutDashboard, Play, ListTodo, Clock, Activity, AlertTriangle, RefreshCw, FileBarChart, Bot, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
}

export const operationsNavigationItems: NavigationItem[] = [
  { id: 'ops-dashboard', label: 'Dashboard', path: '/operations/overview', icon: LayoutDashboard },
  { id: 'ops-executions', label: 'Executions', path: '/operations/executions', icon: Play },
  { id: 'ops-queues', label: 'Queues', path: '/operations/queues', icon: ListTodo },
  { id: 'ops-schedules', label: 'Schedules', path: '/operations/schedules', icon: Clock },
  { id: 'ops-monitoring', label: 'Monitoring', path: '/operations/monitoring', icon: Activity },
  { id: 'ops-alerts', label: 'Alerts', path: '/operations/alerts', icon: AlertTriangle },
  { id: 'ops-retry', label: 'Retry Centre', path: '/operations/retry', icon: RefreshCw },
  { id: 'ops-reports', label: 'Reports', path: '/reports', icon: FileBarChart },
  { id: 'ops-ai', label: 'AI Operations', path: '/ai', icon: Bot },
  { id: 'ops-settings', label: 'Settings', path: '/settings', icon: Settings },
];

export const OperationsNavigation = () => {
  return null;
};
