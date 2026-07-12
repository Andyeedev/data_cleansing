import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const workspaceWidgets: WidgetConfig[] = [
  { id: 'ws-explorer', type: 'grid', title: 'Governance Explorer', size: 'lg' },
  { id: 'ws-policy', type: 'grid', title: 'Policy Explorer', size: 'lg' },
  { id: 'ws-exceptions', type: 'status', title: 'Exception Queue', size: 'lg' },
  { id: 'ws-timeline', type: 'timeline', title: 'Audit Timeline', size: 'lg' },
  { id: 'ws-ai', type: 'ai-summary', title: 'AI Recommendations', size: 'lg' },
  { id: 'ws-notifications', type: 'notification', title: 'Notifications', size: 'lg' },
];

export const GovernanceWorkspace = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Governance Workspace</h1>
        <p className="text-sm text-neutral-60 mt-1">Integrated workspace for governance operations</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workspaceWidgets.map((widget) => (
          <WidgetRenderer key={widget.id} config={widget} data={{}} />
        ))}
      </div>
    </div>
  );
};
