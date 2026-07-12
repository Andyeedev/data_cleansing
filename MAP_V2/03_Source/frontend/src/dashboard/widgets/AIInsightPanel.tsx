import { Lightbulb, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import type { AIInsightPanelProps, AIInsight } from '../framework/dashboard.types';

const typeConfig = {
  recommendation: { icon: Lightbulb, color: 'text-primary-500', bg: 'bg-primary-50' },
  observation: { icon: CheckCircle, color: 'text-info-500', bg: 'bg-info-50' },
  warning: { icon: AlertTriangle, color: 'text-warning-500', bg: 'bg-warning-50' },
  action: { icon: Zap, color: 'text-success-500', bg: 'bg-success-50' },
};

const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'recommendation',
    title: 'Optimize migration batch size',
    description: 'Consider increasing batch size from 1000 to 5000 for better performance.',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Validation rule coverage',
    description: 'Only 78% of data fields have validation rules. Consider adding more.',
  },
  {
    id: '3',
    type: 'observation',
    title: 'Migration trend',
    description: 'Migration success rate has improved by 12% over the last week.',
  },
];

export const AIInsightPanel = ({
  title = 'AI Insights',
  insights = mockInsights,
  className = '',
}: AIInsightPanelProps) => {
  return (
    <div className={`rounded-xl border border-neutral-30 bg-white overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-neutral-30 bg-gradient-to-r from-primary-50 to-transparent">
        <h3 className="text-sm font-semibold text-neutral-100">{title}</h3>
      </div>

      <div className="divide-y divide-neutral-30">
        {insights.map((insight) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;

          return (
            <div key={insight.id} className="px-4 py-3 hover:bg-neutral-20 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-lg ${config.bg}`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-100">{insight.title}</p>
                  <p className="text-xs text-neutral-60 mt-0.5">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
