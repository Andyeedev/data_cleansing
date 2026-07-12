import { FileText, Clock, Star, Calendar, Loader2, AlertTriangle } from 'lucide-react';
import { KPIWidget } from '../../components/widgets/cards/KPIWidget';
import { StatusWidget } from '../../components/widgets/cards/StatusWidget';
import { AISummaryWidget } from '../../components/widgets/ai/AISummaryWidget';
import { useReportCentre } from './hooks/useReportCentre';

export const ReportHome = () => {
  const { metrics } = useReportCentre();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Report Centre</h1>
        <p className="text-neutral-60">Browse, execute, preview and manage all enterprise reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPIWidget
          config={{ id: 'total', type: 'kpi', title: 'Total Reports', size: 'md' }}
          state="success"
          data={{ value: metrics.totalReports, label: 'Total Reports', icon: <FileText className="w-5 h-5" /> }}
        />
        <KPIWidget
          config={{ id: 'recent', type: 'kpi', title: 'Recently Generated', size: 'md' }}
          state="success"
          data={{ value: metrics.recentlyGenerated, label: 'Recently Generated', icon: <Clock className="w-5 h-5" /> }}
        />
        <KPIWidget
          config={{ id: 'favs', type: 'kpi', title: 'Favourite Reports', size: 'md' }}
          state="success"
          data={{ value: metrics.favouriteReports, label: 'Favourite Reports', icon: <Star className="w-5 h-5" /> }}
        />
        <KPIWidget
          config={{ id: 'sched', type: 'kpi', title: 'Scheduled Reports', size: 'md' }}
          state="success"
          data={{ value: metrics.scheduledReports, label: 'Scheduled Reports', icon: <Calendar className="w-5 h-5" /> }}
        />
        <KPIWidget
          config={{ id: 'pending', type: 'kpi', title: 'Pending Reports', size: 'md' }}
          state="success"
          data={{ value: metrics.pendingReports, label: 'Pending Reports', icon: <Loader2 className="w-5 h-5" /> }}
        />
        <KPIWidget
          config={{ id: 'failed', type: 'kpi', title: 'Failed Reports', size: 'md' }}
          state="success"
          data={{ value: metrics.failedReports, label: 'Failed Reports', icon: <AlertTriangle className="w-5 h-5" /> }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AISummaryWidget
          config={{ id: 'ai-rec', type: 'ai-summary', title: 'AI Recommendations', size: 'lg' }}
          state="success"
          data={{
            summary: 'Based on your reporting patterns, consider scheduling the Governance Compliance Report for weekly delivery. The Executive Dashboard Report has not been generated this week.',
            recommendations: [
              'Schedule Governance Compliance Report weekly',
              'Generate Executive Dashboard Report',
              'Review failed Audit Trail Report',
            ],
          }}
        />
        <StatusWidget
          config={{ id: 'status', type: 'status', title: 'Report Status', size: 'lg' }}
          state="success"
          data={{
            status: 'success',
            title: 'System Healthy',
            description: 'All reporting services operational. 7 of 10 reports generated successfully.',
          }}
        />
      </div>
    </div>
  );
};
