import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'cred-1', type: 'status', title: 'Credential Repository', size: 'lg' },
  { id: 'cred-2', type: 'status', title: 'Credential Health', size: 'lg' },
  { id: 'cred-3', type: 'status', title: 'Credential Rotation', size: 'lg' },
  { id: 'cred-4', type: 'status', title: 'Secret References', size: 'lg' },
  { id: 'cred-5', type: 'status', title: 'Expiration Monitoring', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Credential Repository', description: 'All credentials stored securely in Azure Key Vault' },
  { status: 'success' as const, title: 'Credential Health', description: '98.1% of credentials are within policy' },
  { status: 'warning' as const, title: 'Credential Rotation', description: '3 credentials due for rotation within 7 days' },
  { status: 'success' as const, title: 'Secret References', description: 'All secret references are valid and accessible' },
  { status: 'warning' as const, title: 'Expiration Monitoring', description: '5 credentials expiring within 30 days' },
];

export const CredentialManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Credential Management</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage platform credentials and secrets</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
