import { Clock, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { WidgetBody } from '../base/WidgetBody';
import type { WidgetProps } from '../types/WidgetTypes';
import type { SystemWidgetProps } from '../types/WidgetProps';

const typeConfig: Record<string, { icon: typeof Clock; color: string }> = {
  info: { icon: Info, color: 'text-info-500' },
  success: { icon: CheckCircle, color: 'text-success-500' },
  warning: { icon: AlertTriangle, color: 'text-warning-500' },
};

export const TimelineWidget = ({ data }: WidgetProps) => {
  const systemData = data as SystemWidgetProps['data'];
  const timeline = systemData?.timeline || [];

  return (
    <WidgetBody>
      <div className="relative">
        {timeline.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Clock className="w-8 h-8 text-neutral-60 mx-auto" />
              <p className="text-sm text-neutral-60 mt-2">No events</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {timeline.map((event, i) => {
              const cfg = typeConfig[event.type] || typeConfig.info;
              const Icon = cfg.icon;

              return (
                <div key={event.id} className="flex items-start gap-3 relative">
                  {i < timeline.length - 1 && (
                    <div className="absolute left-2 top-6 w-0.5 h-full bg-neutral-30" />
                  )}
                  <div className={`relative z-10 p-1.5 rounded-full bg-white border-2 border-neutral-30`}>
                    <Icon className={`w-3 h-3 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium text-neutral-100">{event.title}</p>
                    <p className="text-xs text-neutral-60 mt-0.5">{event.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </WidgetBody>
  );
};
