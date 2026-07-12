import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'dash-1', type: 'kpi', title: 'Threat Feed', size: 'lg' },
  { id: 'dash-2', type: 'status', title: 'Active Alerts', size: 'lg' },
  { id: 'dash-3', type: 'kpi', title: 'Security KPIs', size: 'lg' },
  { id: 'dash-4', type: 'ai-summary', title: 'AI Recommendations', size: 'lg' },
  { id: 'dash-5', type: 'status', title: 'Compliance Status', size: 'lg' },
  { id: 'dash-6', type: 'timeline', title: 'Security Timeline', size: 'lg' },
];

const sampleData = [
  { value: '2', label: 'Active threat indicators' },
  { status: 'success' as const, title: 'Active Alerts', description: 'No high-severity alerts active' },
  { value: '87.5%', label: 'Security health score' },
  { summary: 'Security posture is strong. Enable conditional access for legacy apps. Rotate 3 credentials within 7 days.' },
  { status: 'success' as const, title: 'Compliance Status', description: '92.3% compliance across all frameworks' },
  { title: 'Security Timeline', description: 'Recent security events and activities' },
];

export const SecurityDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Security Dashboard</h1>
        <p className="text-sm text-neutral-60 mt-1">Operational security workspace</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
