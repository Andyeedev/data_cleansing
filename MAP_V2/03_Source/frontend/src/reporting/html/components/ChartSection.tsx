import React from 'react';
import { BarChart3 } from 'lucide-react';
import type { HtmlReportSectionConfig, HtmlChartData } from '../shared/ReportTypes';
import { ReportSection } from '../framework/ReportSection';
import { BarChartWidget } from '../../../components/widgets/charts/BarChartWidget';
import { LineChartWidget } from '../../../components/widgets/charts/LineChartWidget';
import { PieChartWidget } from '../../../components/widgets/charts/PieChartWidget';
import { AreaChartWidget } from '../../../components/widgets/charts/AreaChartWidget';
import type { WidgetProps } from '../../../components/widgets/types/WidgetTypes';

interface ChartSectionProps {
  section: HtmlReportSectionConfig;
  data?: Record<string, unknown>;
}

const chartWidgetMap: Record<string, React.ComponentType<WidgetProps>> = {
  bar: BarChartWidget as React.ComponentType<WidgetProps>,
  line: LineChartWidget as React.ComponentType<WidgetProps>,
  pie: PieChartWidget as React.ComponentType<WidgetProps>,
  area: AreaChartWidget as React.ComponentType<WidgetProps>,
};

export const ChartSection: React.FC<ChartSectionProps> = ({ section, data }) => {
  const charts = (data?.charts as HtmlChartData[]) ?? [];

  return (
    <ReportSection
      id={section.id}
      title={section.title}
      description={section.description}
      icon={BarChart3}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map((chart) => {
          const ChartWidget = chartWidgetMap[chart.type] ?? BarChartWidget;
          return (
            <div key={chart.id} className="bg-white border border-neutral-20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-neutral-80 mb-3">{chart.title}</h4>
              <ChartWidget
                config={{
                  id: chart.id,
                  type: chart.type,
                  title: chart.title,
                  size: 'lg',
                }}
                state="success"
                data={{
                  series: chart.series,
                  labels: chart.labels,
                }}
              />
            </div>
          );
        })}
      </div>
    </ReportSection>
  );
};
