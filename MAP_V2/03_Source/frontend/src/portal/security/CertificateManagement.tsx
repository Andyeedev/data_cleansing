import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'cert-1', type: 'status', title: 'Certificates', size: 'lg' },
  { id: 'cert-2', type: 'status', title: 'Certificate Expiry', size: 'lg' },
  { id: 'cert-3', type: 'status', title: 'Trusted Certificates', size: 'lg' },
  { id: 'cert-4', type: 'status', title: 'TLS Configuration', size: 'lg' },
  { id: 'cert-5', type: 'status', title: 'Certificate Rotation', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Certificates', description: '18 certificates currently active' },
  { status: 'warning' as const, title: 'Certificate Expiry', description: '3 certificates expiring within 30 days' },
  { status: 'success' as const, title: 'Trusted Certificates', description: 'All certificates from trusted CAs' },
  { status: 'success' as const, title: 'TLS Configuration', description: 'TLS 1.3 enforced across all endpoints' },
  { status: 'success' as const, title: 'Certificate Rotation', description: 'Auto-rotation enabled for all certificates' },
];

export const CertificateManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Certificate Management</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage SSL/TLS certificates and PKI</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
