import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';
import { useSecurityDashboard } from '../hooks/useSecurityDashboard';
import { Shield, Users, AlertTriangle, Smartphone, Key, FileCheck, Lock, Scale, Brain } from 'lucide-react';

const overviewWidgets: WidgetConfig[] = [
  { id: 'sec-kpi-1', type: 'kpi', title: 'Security Health Score', size: 'md', icon: <Shield className="w-5 h-5 text-primary-600" /> },
  { id: 'sec-kpi-2', type: 'kpi', title: 'Active Sessions', size: 'md', icon: <Users className="w-5 h-5 text-primary-600" /> },
  { id: 'sec-kpi-3', type: 'kpi', title: 'Failed Logins', size: 'md', icon: <AlertTriangle className="w-5 h-5 text-error-500" /> },
  { id: 'sec-kpi-4', type: 'kpi', title: 'MFA Adoption', size: 'md', icon: <Smartphone className="w-5 h-5 text-primary-600" /> },
  { id: 'sec-kpi-5', type: 'kpi', title: 'Credential Status', size: 'md', icon: <Key className="w-5 h-5 text-primary-600" /> },
  { id: 'sec-kpi-6', type: 'kpi', title: 'Certificate Status', size: 'md', icon: <FileCheck className="w-5 h-5 text-primary-600" /> },
  { id: 'sec-kpi-7', type: 'kpi', title: 'Encryption Status', size: 'md', icon: <Lock className="w-5 h-5 text-success-500" /> },
  { id: 'sec-kpi-8', type: 'kpi', title: 'Compliance Status', size: 'md', icon: <Scale className="w-5 h-5 text-primary-600" /> },
  { id: 'sec-ai-1', type: 'ai-summary', title: 'Threat Summary', size: 'full', icon: <Brain className="w-5 h-5 text-purple-600" /> },
];

export const SecurityOverview = () => {
  const { metrics } = useSecurityDashboard();

  const kpiData = metrics ? [
    { value: `${metrics.securityHealthScore}%`, label: 'Overall security health index' },
    { value: metrics.activeSessions.toString(), label: 'Currently active user sessions' },
    { value: metrics.failedLogins.toString(), label: 'Failed login attempts in last 24h' },
    { value: `${metrics.mfaAdoption}%`, label: 'Users with MFA enabled' },
    { value: `${metrics.credentialStatus}%`, label: 'Credentials within policy' },
    { value: `${metrics.certificateStatus}%`, label: 'Valid certificates' },
    { value: `${metrics.encryptionStatus}%`, label: 'Data encrypted at rest' },
    { value: `${metrics.complianceStatus}%`, label: 'Compliance score' },
    { value: metrics.threatSummary, label: 'AI-generated threat analysis' },
  ] : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Security Overview</h1>
        <p className="text-sm text-neutral-60 mt-1">Executive security dashboard and threat summary</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {overviewWidgets.map((widget, index) => (
          <WidgetRenderer
            key={widget.id}
            config={widget}
            data={kpiData[index]}
          />
        ))}
      </div>
    </div>
  );
};
