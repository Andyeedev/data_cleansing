import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

interface ExecutiveHealthProps {
  score: number;
  status: string;
}

export const ExecutiveHealth = ({ score, status }: ExecutiveHealthProps) => {
  const gaugeConfig: WidgetConfig = {
    id: 'exec-health-gauge',
    type: 'gauge',
    title: 'Migration Health Score',
    size: 'md',
  };

  return (
    <div className="bg-white border border-neutral-30 rounded-xl p-4">
      <WidgetRenderer
        config={gaugeConfig}
        data={{
          value: score,
          label: 'Health Score',
          max: 100,
        }}
      />
      <div className="mt-4 text-center">
        <span className="text-sm text-neutral-60">Programme Status: </span>
        <span className="text-sm font-semibold text-neutral-100">{status}</span>
      </div>
    </div>
  );
};
