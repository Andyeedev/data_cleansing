import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

interface ExecutiveInsightsProps {
  summary: string;
}

export const ExecutiveInsights = ({ summary }: ExecutiveInsightsProps) => {
  const aiConfig: WidgetConfig = {
    id: 'exec-ai-summary',
    type: 'ai-summary',
    title: 'AI Executive Summary',
    size: 'md',
  };

  return (
    <div className="bg-white border border-neutral-30 rounded-xl p-4">
      <WidgetRenderer
        config={aiConfig}
        data={{
          summary,
          insights: [
            { id: 'i1', type: 'positive', title: 'Validation Success', description: 'Control success rate at 99.6%, above target' },
            { id: 'i2', type: 'warning', title: 'Warning Volume', description: 'One project shows increased warning trend' },
            { id: 'i3', type: 'info', title: 'Confidence Score', description: 'Overall confidence remains high at 94%' },
          ],
        }}
      />
    </div>
  );
};
