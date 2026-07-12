import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'ws-rpt-1', type: 'grid', title: 'Report Explorer', size: 'lg' },
  { id: 'ws-rpt-2', type: 'grid', title: 'Template Library', size: 'lg' },
  { id: 'ws-rpt-3', type: 'status', title: 'Recent Reports', size: 'lg' },
  { id: 'ws-rpt-4', type: 'status', title: 'Scheduled Reports', size: 'lg' },
  { id: 'ws-rpt-5', type: 'ai-summary', title: 'AI Recommendations', size: 'lg' },
  { id: 'ws-rpt-6', type: 'notification', title: 'Notifications', size: 'lg' },
];

export const ReportingWorkspace = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Reporting Workspace</h1>
        <p className="text-sm text-neutral-60 mt-1">Integrated workspace for report operations</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget) => (
          <WidgetRenderer key={widget.id} config={widget} data={{}} />
        ))}
      </div>
    </div>
  );
};
