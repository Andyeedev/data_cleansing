import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'threat-1', type: 'status', title: 'Security Monitoring', size: 'lg' },
  { id: 'threat-2', type: 'status', title: 'Threat Intelligence', size: 'lg' },
  { id: 'threat-3', type: 'status', title: 'Risk Alerts', size: 'lg' },
  { id: 'threat-4', type: 'status', title: 'Security Dashboard', size: 'lg' },
  { id: 'threat-5', type: 'status', title: 'Incident Overview', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Security Monitoring', description: 'Real-time monitoring active across all systems' },
  { status: 'success' as const, title: 'Threat Intelligence', description: 'Threat feeds updated 2 hours ago' },
  { status: 'success' as const, title: 'Risk Alerts', description: 'No high-severity risk alerts' },
  { status: 'success' as const, title: 'Security Dashboard', description: 'All security metrics within thresholds' },
  { status: 'success' as const, title: 'Incident Overview', description: '0 open incidents, 3 resolved this week' },
];

export const ThreatMonitoring = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Threat Monitoring</h1>
        <p className="text-sm text-neutral-60 mt-1">Real-time threat detection and monitoring</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
