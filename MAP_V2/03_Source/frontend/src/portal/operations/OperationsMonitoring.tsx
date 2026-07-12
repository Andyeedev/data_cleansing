import type { OperationsActivityItem } from '../types/OperationsQueue';

interface OperationsMonitoringProps {
  activities: OperationsActivityItem[];
}

const activityStyles = {
  success: 'border-l-success-500 bg-success-50',
  warning: 'border-l-warning-500 bg-warning-50',
  error: 'border-l-error-500 bg-error-50',
  info: 'border-l-info-500 bg-info-50',
};

export const OperationsMonitoring = ({ activities }: OperationsMonitoringProps) => {
  return (
    <div className="bg-white border border-neutral-30 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-neutral-100 mb-4">Recent Activity</h3>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`border-l-4 rounded-r-lg p-2 ${activityStyles[activity.status || 'info']}`}
          >
            <p className="text-xs font-medium text-neutral-100">{activity.title}</p>
            <p className="text-[10px] text-neutral-60">{activity.description}</p>
            <span className="text-[10px] text-neutral-50">{activity.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
