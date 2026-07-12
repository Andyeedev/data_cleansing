import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';
import { useGovernanceDashboard } from '../hooks/useGovernanceDashboard';
import { Shield, FileText, AlertTriangle, Search, Heart, Settings, Brain } from 'lucide-react';

const overviewWidgets: WidgetConfig[] = [
  { id: 'gov-kpi-1', type: 'kpi', title: 'Overall Compliance Score', size: 'md', icon: <Shield className="w-5 h-5 text-primary-600" /> },
  { id: 'gov-kpi-2', type: 'kpi', title: 'Policy Compliance', size: 'md', icon: <FileText className="w-5 h-5 text-primary-600" /> },
  { id: 'gov-kpi-3', type: 'kpi', title: 'Active Exceptions', size: 'md', icon: <AlertTriangle className="w-5 h-5 text-warning-500" /> },
  { id: 'gov-kpi-4', type: 'kpi', title: 'Audit Findings', size: 'md', icon: <Search className="w-5 h-5 text-primary-600" /> },
  { id: 'gov-kpi-5', type: 'kpi', title: 'Governance Health', size: 'md', icon: <Heart className="w-5 h-5 text-success-500" /> },
  { id: 'gov-kpi-6', type: 'kpi', title: 'Control Effectiveness', size: 'md', icon: <Settings className="w-5 h-5 text-primary-600" /> },
  { id: 'gov-ai-1', type: 'ai-summary', title: 'AI Governance Summary', size: 'full', icon: <Brain className="w-5 h-5 text-purple-600" /> },
];

export const GovernanceOverview = () => {
  const { metrics } = useGovernanceDashboard();

  const kpiData = metrics ? [
    { value: `${metrics.overallComplianceScore}%`, label: 'Overall compliance score across all frameworks' },
    { value: `${metrics.policyCompliance}%`, label: 'Policies meeting compliance requirements' },
    { value: metrics.activeExceptions.toString(), label: 'Active exceptions requiring attention' },
    { value: metrics.auditFindings.toString(), label: 'Open audit findings to resolve' },
    { value: `${metrics.governanceHealth}%`, label: 'Overall governance health index' },
    { value: `${metrics.controlEffectiveness}%`, label: 'Controls operating effectively' },
    { value: metrics.aiGovernanceSummary, label: 'AI-generated governance insights' },
  ] : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Governance Overview</h1>
        <p className="text-sm text-neutral-60 mt-1">Executive summary of governance, compliance and audit status</p>
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
