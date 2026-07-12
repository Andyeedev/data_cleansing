import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'idp-1', type: 'status', title: 'Microsoft Entra ID', size: 'lg' },
  { id: 'idp-2', type: 'status', title: 'Azure Active Directory', size: 'lg' },
  { id: 'idp-3', type: 'status', title: 'OAuth Providers', size: 'lg' },
  { id: 'idp-4', type: 'status', title: 'OpenID Connect', size: 'lg' },
  { id: 'idp-5', type: 'status', title: 'Local Authentication', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Microsoft Entra ID', description: 'Connected and syncing users' },
  { status: 'success' as const, title: 'Azure Active Directory', description: 'Integrated with 3 tenants' },
  { status: 'success' as const, title: 'OAuth Providers', description: 'Google and GitHub OAuth configured' },
  { status: 'success' as const, title: 'OpenID Connect', description: 'OIDC provider active' },
  { status: 'info' as const, title: 'Local Authentication', description: 'Local accounts for admin fallback' },
];

export const IdentityProviders = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Identity Providers</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage identity providers and federation</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
