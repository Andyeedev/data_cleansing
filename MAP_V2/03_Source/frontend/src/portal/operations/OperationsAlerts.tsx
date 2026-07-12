import type { OperationsAlert } from '../types/OperationsQueue';

interface OperationsAlertsProps {
  alerts: OperationsAlert[];
  isLoading?: boolean;
}

const typeStyles = {
  critical: 'border-l-error-500 bg-error-50',
  warning: 'border-l-warning-500 bg-warning-50',
  info: 'border-l-info-500 bg-info-50',
  timeout: 'border-l-error-500 bg-error-50',
  dependency: 'border-l-warning-500 bg-warning-50',
  validation: 'border-l-warning-500 bg-warning-50',
  infrastructure: 'border-l-error-500 bg-error-50',
};

export const OperationsAlerts = ({ alerts }: OperationsAlertsProps) => {
  return (
    <div className="bg-white border border-neutral-30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-100">Alerts</h3>
        <span className="text-xs text-error-500 font-medium">
          {alerts.filter((a) => !a.acknowledged).length} unread
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border-l-4 rounded-r-lg p-3 ${typeStyles[alert.type]} ${!alert.acknowledged ? 'font-medium' : 'opacity-70'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-neutral-100 truncate">{alert.title}</p>
                <p className="text-[10px] text-neutral-60 truncate">{alert.message}</p>
                <p className="text-[10px] text-neutral-50 mt-1">{alert.source}</p>
              </div>
              <span className="text-[10px] text-neutral-50 whitespace-nowrap">{alert.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
