import { Bell, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { WidgetBody } from '../base/WidgetBody';
import type { WidgetProps } from '../types/WidgetTypes';
import type { SystemWidgetProps } from '../types/WidgetProps';

const typeConfig: Record<string, { icon: typeof Bell; color: string }> = {
  info: { icon: Info, color: 'text-info-500' },
  success: { icon: CheckCircle, color: 'text-success-500' },
  warning: { icon: AlertTriangle, color: 'text-warning-500' },
  error: { icon: XCircle, color: 'text-error-500' },
};

export const NotificationWidget = ({ data }: WidgetProps) => {
  const systemData = data as SystemWidgetProps['data'];
  const notifications = systemData?.notifications || [];

  return (
    <WidgetBody>
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Bell className="w-8 h-8 text-neutral-60 mx-auto" />
              <p className="text-sm text-neutral-60 mt-2">No notifications</p>
            </div>
          </div>
        ) : (
          notifications.map((notif) => {
            const cfg = typeConfig[notif.type] || typeConfig.info;
            const Icon = cfg.icon;

            return (
              <div
                key={notif.id}
                className="flex items-start gap-3 p-2 hover:bg-neutral-20 rounded-lg transition-colors"
              >
                <Icon className={`w-4 h-4 mt-0.5 ${cfg.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-100">{notif.title}</p>
                  <p className="text-xs text-neutral-60 truncate">{notif.message}</p>
                </div>
                <span className="text-xs text-neutral-60 whitespace-nowrap">{notif.timestamp}</span>
              </div>
            );
          })
        )}
      </div>
    </WidgetBody>
  );
};
