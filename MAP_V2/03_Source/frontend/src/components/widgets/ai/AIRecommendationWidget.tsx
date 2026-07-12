import { Zap, ArrowRight } from 'lucide-react';
import { WidgetBody } from '../base/WidgetBody';
import type { WidgetProps } from '../types/WidgetTypes';
import type { AIWidgetProps } from '../types/WidgetProps';

const priorityColors: Record<string, string> = {
  high: 'border-l-error-500 bg-error-50',
  medium: 'border-l-warning-500 bg-warning-50',
  low: 'border-l-success-500 bg-success-50',
};

export const AIRecommendationWidget = ({ data }: WidgetProps) => {
  const aiData = data as AIWidgetProps['data'];

  const recommendations = aiData?.recommendations || [];

  return (
    <WidgetBody>
      <div className="space-y-3">
        {recommendations.length === 0 ? (
          <div className="flex items-center justify-center h-32 bg-neutral-20 rounded-lg">
            <p className="text-sm text-neutral-60">No recommendations</p>
          </div>
        ) : (
          recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`p-3 rounded-lg border-l-4 ${priorityColors[rec.priority] || priorityColors.medium}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-primary-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-neutral-100">{rec.title}</p>
                    <p className="text-xs text-neutral-60 mt-0.5">{rec.description}</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-neutral-20 rounded-md transition-colors">
                  <ArrowRight className="w-4 h-4 text-neutral-60" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </WidgetBody>
  );
};
