import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'enc-1', type: 'status', title: 'Encryption Status', size: 'lg' },
  { id: 'enc-2', type: 'status', title: 'Encryption Algorithms', size: 'lg' },
  { id: 'enc-3', type: 'status', title: 'Data Protection', size: 'lg' },
  { id: 'enc-4', type: 'status', title: 'Key Rotation', size: 'lg' },
  { id: 'enc-5', type: 'status', title: 'Encryption Policies', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Encryption Status', description: '100% of data encrypted at rest and in transit' },
  { status: 'success' as const, title: 'Encryption Algorithms', description: 'AES-256 and RSA-4096 in use' },
  { status: 'success' as const, title: 'Data Protection', description: 'All sensitive data classified and protected' },
  { status: 'success' as const, title: 'Key Rotation', description: 'Keys rotated within policy window' },
  { status: 'success' as const, title: 'Encryption Policies', description: 'All encryption policies enforced' },
];

export const EncryptionManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Encryption Management</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage encryption policies and data protection</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
