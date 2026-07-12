import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const widgets: WidgetConfig[] = [
  { id: 'auth-1', type: 'status', title: 'Password Policies', size: 'lg' },
  { id: 'auth-2', type: 'status', title: 'Session Policies', size: 'lg' },
  { id: 'auth-3', type: 'status', title: 'Login Policies', size: 'lg' },
  { id: 'auth-4', type: 'status', title: 'Access Policies', size: 'lg' },
  { id: 'auth-5', type: 'status', title: 'Lockout Policies', size: 'lg' },
];

const sampleData = [
  { status: 'success' as const, title: 'Password Policies', description: '12+ chars, complexity enforced, 90-day rotation' },
  { status: 'success' as const, title: 'Session Policies', description: '30-minute timeout, secure cookies enabled' },
  { status: 'success' as const, title: 'Login Policies', description: 'Max 5 attempts, 15-minute lockout' },
  { status: 'success' as const, title: 'Access Policies', description: 'RBAC enforced, least privilege applied' },
  { status: 'success' as const, title: 'Lockout Policies', description: 'Account lockout after 5 failed attempts' },
];

export const AuthenticationPolicies = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Authentication Policies</h1>
        <p className="text-sm text-neutral-60 mt-1">Manage authentication and access policies</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget, index) => (
          <WidgetRenderer key={widget.id} config={widget} data={sampleData[index]} />
        ))}
      </div>
    </div>
  );
};
