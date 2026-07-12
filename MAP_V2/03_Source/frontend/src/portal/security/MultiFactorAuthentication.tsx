import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'mfa-1', type: 'status', title: 'Authenticator Apps', size: 'lg' },
  { id: 'mfa-2', type: 'status', title: 'SMS Verification', size: 'lg' },
  { id: 'mfa-3', type: 'status', title: 'Email Verification', size: 'lg' },
  { id: 'mfa-4', type: 'status', title: 'Hardware Tokens', size: 'lg' },
  { id: 'mfa-5', type: 'status', title: 'MFA Compliance', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Authenticator Apps', description: '89% of users using authenticator apps' },
  { status: 'success' as const, title: 'SMS Verification', description: 'SMS fallback enabled for all users' },
  { status: 'success' as const, title: 'Email Verification', description: 'Email verification for new devices' },
  { status: 'info' as const, title: 'Hardware Tokens', description: 'Hardware tokens for admin accounts' },
  { status: 'success' as const, title: 'MFA Compliance', description: '94.2% MFA adoption rate' },
];

export const MultiFactorAuthentication = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Multi-Factor Authentication</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage MFA policies and configurations</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
