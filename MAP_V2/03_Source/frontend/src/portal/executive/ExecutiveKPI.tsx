import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';
import type { ExecutiveKPIData } from '../types/ExecutiveDashboard';

interface ExecutiveKPIProps {
  kpis: ExecutiveKPIData[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const ExecutiveKPI = ({ kpis, onRefresh }: ExecutiveKPIProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi) => {
        const config: WidgetConfig = {
          id: kpi.id,
          type: 'kpi',
          title: kpi.label,
          size: 'md',
        };

        return (
          <WidgetRenderer
            key={kpi.id}
            config={config}
            data={{
              value: kpi.value,
              label: kpi.label,
              delta: kpi.delta,
              trend: kpi.trend,
            }}
            onRefresh={onRefresh}
          />
        );
      })}
    </div>
  );
};
