import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';
import { useReportingDashboard } from '../hooks/useReportingDashboard';
import { BarChart3, Clock, AlertTriangle, Hourglass, Eye, Download, Brain } from 'lucide-react';

const overviewWidgets: WidgetConfig[] = [
  { id: 'rpt-kpi-1', type: 'kpi', title: 'Reports Generated', size: 'md', icon: <BarChart3 className="w-5 h-5 text-primary-600" /> },
  { id: 'rpt-kpi-2', type: 'kpi', title: 'Scheduled Reports', size: 'md', icon: <Clock className="w-5 h-5 text-primary-600" /> },
  { id: 'rpt-kpi-3', type: 'kpi', title: 'Failed Reports', size: 'md', icon: <AlertTriangle className="w-5 h-5 text-error-500" /> },
  { id: 'rpt-kpi-4', type: 'kpi', title: 'Pending Reports', size: 'md', icon: <Hourglass className="w-5 h-5 text-warning-500" /> },
  { id: 'rpt-kpi-5', type: 'kpi', title: 'Report Usage', size: 'md', icon: <Eye className="w-5 h-5 text-primary-600" /> },
  { id: 'rpt-kpi-6', type: 'kpi', title: 'Export Activity', size: 'md', icon: <Download className="w-5 h-5 text-primary-600" /> },
  { id: 'rpt-ai-1', type: 'ai-summary', title: 'AI Report Summary', size: 'full', icon: <Brain className="w-5 h-5 text-purple-600" /> },
];

export const ReportingOverview = () => {
  const { metrics } = useReportingDashboard();

  const kpiData = metrics ? [
    { value: metrics.reportsGenerated.toLocaleString(), label: 'Total reports generated this month' },
    { value: metrics.scheduledReports.toString(), label: 'Reports on scheduled cadence' },
    { value: metrics.failedReports.toString(), label: 'Reports requiring attention' },
    { value: metrics.pendingReports.toString(), label: 'Reports awaiting execution' },
    { value: metrics.reportUsage.toLocaleString(), label: 'Report views this month' },
    { value: metrics.exportActivity.toLocaleString(), label: 'Export downloads this month' },
    { value: metrics.aiReportSummary, label: 'AI-generated report insights' },
  ] : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Reporting Overview</h1>
        <p className="text-sm text-neutral-60 mt-1">Enterprise reporting dashboard and analytics</p>
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
