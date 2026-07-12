import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import { Users, Building2, FolderTree, Wifi, Clock, Heart, Key, ToggleRight, AlertTriangle } from 'lucide-react';

const overviewWidgets: WidgetConfig[] = [
  { id: 'adm-kpi-1', type: 'kpi', title: 'Active Users', size: 'md', icon: <Users className="w-5 h-5 text-primary-600" /> },
  { id: 'adm-kpi-2', type: 'kpi', title: 'Active Tenants', size: 'md', icon: <Building2 className="w-5 h-5 text-primary-600" /> },
  { id: 'adm-kpi-3', type: 'kpi', title: 'Organisations', size: 'md', icon: <FolderTree className="w-5 h-5 text-primary-600" /> },
  { id: 'adm-kpi-4', type: 'kpi', title: 'Active Sessions', size: 'md', icon: <Wifi className="w-5 h-5 text-primary-600" /> },
  { id: 'adm-kpi-5', type: 'kpi', title: 'Scheduled Jobs', size: 'md', icon: <Clock className="w-5 h-5 text-primary-600" /> },
  { id: 'adm-kpi-6', type: 'kpi', title: 'Platform Health', size: 'md', icon: <Heart className="w-5 h-5 text-success-500" /> },
  { id: 'adm-kpi-7', type: 'kpi', title: 'Licence Usage', size: 'md', icon: <Key className="w-5 h-5 text-primary-600" /> },
  { id: 'adm-kpi-8', type: 'kpi', title: 'Feature Status', size: 'md', icon: <ToggleRight className="w-5 h-5 text-primary-600" /> },
  { id: 'adm-ai-1', type: 'ai-summary', title: 'System Alerts', size: 'full', icon: <AlertTriangle className="w-5 h-5 text-warning-500" /> },
];

export const AdministrationOverview = () => {
  const { metrics } = useAdminDashboard();

  const kpiData = metrics ? [
    { value: metrics.activeUsers.toLocaleString(), label: 'Users currently active on the platform' },
    { value: metrics.activeTenants.toString(), label: 'Tenants with active subscriptions' },
    { value: metrics.organisations.toString(), label: 'Registered organisations and business units' },
    { value: metrics.activeSessions.toString(), label: 'Currently active user sessions' },
    { value: metrics.scheduledJobs.toString(), label: 'Jobs scheduled in the task queue' },
    { value: `${metrics.platformHealth}%`, label: 'Overall platform health score' },
    { value: `${metrics.licenceUsage}%`, label: 'Licence allocation utilisation' },
    { value: `${metrics.featureStatus}%`, label: 'Features enabled across the platform' },
    { value: metrics.systemAlerts, label: 'Active system warnings and alerts' },
  ] : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Administration Overview</h1>
        <p className="text-sm text-neutral-60 mt-1">Platform administration dashboard and system health</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {overviewWidgets.map((widget, index) => (
          <WidgetRenderer
            key={widget.id}
            config={widget}
            data={kpiData[index]}
          />
        ))}
      </div>
    </div>
  );
};
