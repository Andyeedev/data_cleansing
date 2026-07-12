import React from 'react';
import { Table } from 'lucide-react';
import type { HtmlReportSectionConfig, HtmlTableData } from '../shared/ReportTypes';
import { ReportSection } from '../framework/ReportSection';
import { GridWidget } from '../../../components/widgets/tables/GridWidget';

interface TableSectionProps {
  section: HtmlReportSectionConfig;
  data?: Record<string, unknown>;
}

export const TableSection: React.FC<TableSectionProps> = ({ section, data }) => {
  const tables = (data?.tables as HtmlTableData[]) ?? [];

  return (
    <ReportSection
      id={section.id}
      title={section.title}
      description={section.description}
      icon={Table}
    >
      <div className="space-y-6">
        {tables.map((table) => (
          <div key={table.id}>
            {table.title && (
              <h4 className="text-sm font-medium text-neutral-80 mb-3">{table.title}</h4>
            )}
            <GridWidget
              config={{
                id: table.id,
                type: 'grid',
                title: table.title,
                size: 'full',
              }}
              state="success"
              data={{
                columns: table.columns,
                rows: table.rows,
              }}
            />
          </div>
        ))}
      </div>
    </ReportSection>
  );
};
