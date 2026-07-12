import React from 'react';
import { BarChart3 } from 'lucide-react';
import type { HtmlReportSectionConfig, HtmlKPIData } from '../shared/ReportTypes';
import { ReportSection } from '../framework/ReportSection';
import { KPIWidget } from '../../../components/widgets/cards/KPIWidget';

interface KPISectionProps {
  section: HtmlReportSectionConfig;
  data?: Record<string, unknown>;
}

export const KPISection: React.FC<KPISectionProps> = ({ section, data }) => {
  const kpis = (data?.kpis as HtmlKPIData[]) ?? [];

  return (
    <ReportSection
      id={section.id}
      title={section.title}
      description={section.description}
      icon={BarChart3}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <KPIWidget
            key={kpi.id}
            config={{
              id: kpi.id,
              type: 'kpi',
              title: kpi.label,
              size: 'md',
            }}
            state="success"
            data={{
              value: kpi.value,
              label: kpi.label,
              delta: kpi.delta,
            }}
          />
        ))}
      </div>
    </ReportSection>
  );
};
