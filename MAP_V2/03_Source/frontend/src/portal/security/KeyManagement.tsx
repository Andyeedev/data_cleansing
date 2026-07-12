import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'key-1', type: 'status', title: 'Key Inventory', size: 'lg' },
  { id: 'key-2', type: 'status', title: 'Key Rotation', size: 'lg' },
  { id: 'key-3', type: 'status', title: 'Key Expiration', size: 'lg' },
  { id: 'key-4', type: 'status', title: 'Azure Key Vault Integration', size: 'lg' },
  { id: 'key-5', type: 'status', title: 'HSM Integration', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Key Inventory', description: '24 encryption keys managed across 2 vaults' },
  { status: 'success' as const, title: 'Key Rotation', description: 'All keys rotated within 90-day policy' },
  { status: 'warning' as const, title: 'Key Expiration', description: '2 keys expiring within 30 days' },
  { status: 'success' as const, title: 'Azure Key Vault Integration', description: 'Connected to 2 Key Vault instances' },
  { status: 'success' as const, title: 'HSM Integration', description: 'HSM-backed keys for critical operations' },
];

export const KeyManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Key Management</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage encryption keys and HSM integration</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
