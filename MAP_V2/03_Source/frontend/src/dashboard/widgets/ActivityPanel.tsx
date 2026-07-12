import { Clock, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import type { ActivityPanelProps, ActivityItem } from '../framework/dashboard.types';

const typeConfig = {
  info: { icon: Info, color: 'text-info-500' },
  success: { icon: CheckCircle, color: 'text-success-500' },
  warning: { icon: AlertTriangle, color: 'text-warning-500' },
  error: { icon: XCircle, color: 'text-error-500' },
};

const mockActivities: ActivityItem[] = [
  { id: '1', title: 'System started', description: 'MAP Nexus™ initialized', timestamp: '2 min ago', type: 'info' },
  { id: '2', title: 'Migration completed', description: 'Customer data migrated', timestamp: '15 min ago', type: 'success' },
  { id: '3', title: 'Validation warning', description: '3 rules need attention', timestamp: '1 hour ago', type: 'warning' },
];

export const ActivityPanel = ({
  title = 'Recent Activity',
  activities = mockActivities,
  className = '',
}: ActivityPanelProps) => {
  return (
    <div className={`rounded-xl border border-neutral-30 bg-white overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-neutral-30">
        <h3 className="text-sm font-semibold text-neutral-100">{title}</h3>
      </div>

      <div className="divide-y divide-neutral-30">
        {activities.map((activity) => {
          const config = typeConfig[activity.type];
          const Icon = config.icon;

          return (
            <div key={activity.id} className="px-4 py-3 hover:bg-neutral-20 transition-colors">
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 mt-0.5 ${config.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-100">{activity.title}</p>
                  {activity.description && (
                    <p className="text-xs text-neutral-60 mt-0.5">{activity.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-60">
                  <Clock className="w-3 h-3" />
                  {activity.timestamp}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
