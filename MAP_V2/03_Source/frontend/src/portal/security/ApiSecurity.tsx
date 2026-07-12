import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'api-1', type: 'status', title: 'API Keys', size: 'lg' },
  { id: 'api-2', type: 'status', title: 'OAuth Clients', size: 'lg' },
  { id: 'api-3', type: 'status', title: 'Service Accounts', size: 'lg' },
  { id: 'api-4', type: 'status', title: 'API Rate Limits', size: 'lg' },
  { id: 'api-5', type: 'status', title: 'API Audit', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'API Keys', description: '12 active API keys, 3 expiring soon' },
  { status: 'success' as const, title: 'OAuth Clients', description: '8 registered OAuth clients' },
  { status: 'success' as const, title: 'Service Accounts', description: '5 service accounts for integrations' },
  { status: 'success' as const, title: 'API Rate Limits', description: 'Rate limiting enforced on all endpoints' },
  { status: 'success' as const, title: 'API Audit', description: 'All API calls logged and auditable' },
];

export const ApiSecurity = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">API Security</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage API keys, OAuth clients, and rate limiting</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
