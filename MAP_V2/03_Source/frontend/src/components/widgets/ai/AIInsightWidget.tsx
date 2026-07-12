import { Lightbulb, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { WidgetBody } from '../base/WidgetBody';
import type { WidgetProps } from '../types/WidgetTypes';
import type { AIWidgetProps } from '../types/WidgetProps';

const typeConfig: Record<string, { icon: typeof Lightbulb; color: string; bg: string }> = {
  observation: { icon: Lightbulb, color: 'text-primary-500', bg: 'bg-primary-50' },
  warning: { icon: AlertTriangle, color: 'text-warning-500', bg: 'bg-warning-50' },
  success: { icon: CheckCircle, color: 'text-success-500', bg: 'bg-success-50' },
  info: { icon: Info, color: 'text-info-500', bg: 'bg-info-50' },
};

export const AIInsightWidget = ({ data }: WidgetProps) => {
  const aiData = data as AIWidgetProps['data'];

  const insights = aiData?.insights || [];

  return (
    <WidgetBody>
      <div className="space-y-3">
        {insights.length === 0 ? (
          <div className="flex items-center justify-center h-32 bg-neutral-20 rounded-lg">
            <p className="text-sm text-neutral-60">No insights available</p>
          </div>
        ) : (
          insights.map((insight) => {
            const cfg = typeConfig[insight.type] || typeConfig.info;
            const Icon = cfg.icon;

            return (
              <div
                key={insight.id}
                className="flex items-start gap-3 p-3 bg-neutral-20 rounded-lg"
              >
                <div className={`p-1.5 rounded-lg ${cfg.bg}`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-100">{insight.title}</p>
                  <p className="text-xs text-neutral-60 mt-0.5">{insight.description}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </WidgetBody>
  );
};
