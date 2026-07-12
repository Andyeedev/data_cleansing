import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';
import { useMigrationDashboard } from '../hooks/useMigrationDashboard';

export const MigrationOverview = () => {
  const { metrics, refresh } = useMigrationDashboard();

  const kpis = [
    { id: 'mig-projects', label: 'Active Projects', value: metrics.activeProjects, color: 'text-primary-500' },
    { id: 'mig-running', label: 'Running Executions', value: metrics.runningExecutions, color: 'text-success-500' },
    { id: 'mig-completed', label: 'Completed', value: metrics.completedMigrations, color: 'text-success-500' },
    { id: 'mig-failed', label: 'Failed', value: metrics.failedExecutions, color: 'text-error-500' },
    { id: 'mig-rate', label: 'Success Rate', value: `${metrics.successRate}%`, color: 'text-success-500' },
    { id: 'mig-health', label: 'Migration Health', value: `${metrics.migrationHealth}%`, color: 'text-primary-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">Migration Portal</h1>
        <p className="text-primary-100 text-sm">Manage migration projects, datasets, mappings, and execution</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => {
          const config: WidgetConfig = {
            id: kpi.id,
            type: 'kpi',
            title: kpi.label,
            size: 'md',
          };

          return (
            <WidgetRenderer
              key={kpi.id}
              config={config}
              data={{ value: kpi.value, label: kpi.label }}
              onRefresh={refresh}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-30 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-neutral-100 mb-3">AI Migration Summary</h3>
          <p className="text-xs text-neutral-60">
            Migration progressing well. 8 active projects with 5 running executions.
            Success rate at 98.7%. 14 datasets pending mapping configuration.
            Recommended action: Complete remaining dataset mappings before next execution window.
          </p>
        </div>

        <div className="bg-white border border-neutral-30 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-neutral-100 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-2 text-xs bg-primary-50 text-primary-500 rounded-lg hover:bg-primary-100 transition-colors">
              Start Migration
            </button>
            <button className="p-2 text-xs bg-success-50 text-success-500 rounded-lg hover:bg-success-100 transition-colors">
              View Projects
            </button>
            <button className="p-2 text-xs bg-warning-50 text-warning-500 rounded-lg hover:bg-warning-100 transition-colors">
              Check Datasets
            </button>
            <button className="p-2 text-xs bg-info-50 text-info-500 rounded-lg hover:bg-info-100 transition-colors">
              Open Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
