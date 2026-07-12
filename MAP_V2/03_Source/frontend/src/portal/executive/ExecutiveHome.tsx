import { useExecutiveDashboard } from '../hooks/useExecutiveDashboard';
import { ExecutiveSummary } from './ExecutiveSummary';
import { ExecutiveKPI } from './ExecutiveKPI';
import { ExecutiveHealth } from './ExecutiveHealth';
import { ExecutiveRisk } from './ExecutiveRisk';
import { ExecutiveInsights } from './ExecutiveInsights';
import { ExecutiveActions } from './ExecutiveActions';
import { ExecutiveNotifications } from './ExecutiveNotifications';

export const ExecutiveHome = () => {
  const { metrics, kpis, notifications, isLoading, refresh } = useExecutiveDashboard();

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <ExecutiveSummary
        programme="Migration Programme"
        phase="Execution"
        status={metrics.programmeStatus}
        completion={metrics.completionPercentage}
        confidence={metrics.confidenceScore}
        lastExecution="Today 14:30 UTC"
      />

      {/* KPI Cards */}
      <ExecutiveKPI kpis={kpis} isLoading={isLoading} onRefresh={refresh} />

      {/* Health + Risk + Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ExecutiveHealth
          score={metrics.migrationHealth}
          status={metrics.programmeStatus}
        />
        <ExecutiveRisk
          level={metrics.overallRiskLevel}
          score={metrics.overallRiskScore}
          critical={metrics.criticalRisks}
          high={metrics.highRisks}
          medium={metrics.mediumRisks}
          low={metrics.lowRisks}
        />
        <ExecutiveInsights summary={metrics.aiSummary} />
      </div>

      {/* Actions + Notifications Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExecutiveActions />
        <ExecutiveNotifications notifications={notifications} />
      </div>
    </div>
  );
};
