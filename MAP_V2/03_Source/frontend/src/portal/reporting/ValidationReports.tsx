import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'val-rpt-1', type: 'status', title: 'Rule Execution', size: 'lg' },
  { id: 'val-rpt-2', type: 'status', title: 'Validation Summary', size: 'lg' },
  { id: 'val-rpt-3', type: 'status', title: 'Failed Controls', size: 'lg' },
  { id: 'val-rpt-4', type: 'status', title: 'Passed Controls', size: 'lg' },
  { id: 'val-rpt-5', type: 'status', title: 'Validation Trends', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Rule Execution', description: 'Summary of all validation rule executions and results' },
  { status: 'success' as const, title: 'Validation Summary', description: 'Overall validation status across all datasets' },
  { status: 'error' as const, title: 'Failed Controls', description: 'Details of controls that failed validation' },
  { status: 'success' as const, title: 'Passed Controls', description: 'Controls that passed validation successfully' },
  { status: 'info' as const, title: 'Validation Trends', description: 'Trend analysis of validation results over time' },
];

export const ValidationReports = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Validation Reports</h1>
        <p className="text-sm text-neutral-60 mt-1">Data validation and control reporting</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
