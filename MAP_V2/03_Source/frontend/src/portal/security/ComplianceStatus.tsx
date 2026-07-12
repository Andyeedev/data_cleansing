import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'comp-1', type: 'status', title: 'GDPR', size: 'lg' },
  { id: 'comp-2', type: 'status', title: 'ISO 27001', size: 'lg' },
  { id: 'comp-3', type: 'status', title: 'SOC 2', size: 'lg' },
  { id: 'comp-4', type: 'status', title: 'Internal Policies', size: 'lg' },
  { id: 'comp-5', type: 'kpi', title: 'Compliance Score', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'GDPR', description: 'GDPR compliance active, DPO appointed' },
  { status: 'success' as const, title: 'ISO 27001', description: 'ISO 27001 certification current' },
  { status: 'success' as const, title: 'SOC 2', description: 'SOC 2 Type II audit completed' },
  { status: 'success' as const, title: 'Internal Policies', description: 'All internal policies enforced' },
  { value: '92.3%', label: 'Overall compliance score across all frameworks' },
];

export const ComplianceStatus = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Compliance Status</h1>
        <p className="text-sm text-neutral-60 mt-1">Regulatory and compliance monitoring</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
