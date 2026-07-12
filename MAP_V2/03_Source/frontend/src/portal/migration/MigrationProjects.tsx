import { WidgetRenderer } from '../../components/widgets/engine/WidgetRenderer';
import type { WidgetConfig } from '../../components/widgets/types/WidgetTypes';

const projects = [
  { id: 'p1', name: 'Core Customer Migration', status: 'running', progress: 78, team: 'Team Alpha', datasets: 24 },
  { id: 'p2', name: 'Transaction Data Sync', status: 'running', progress: 65, team: 'Team Beta', datasets: 18 },
  { id: 'p3', name: 'Account Data Migration', status: 'queued', progress: 0, team: 'Team Alpha', datasets: 12 },
  { id: 'p4', name: 'Product Catalog Transfer', status: 'completed', progress: 100, team: 'Team Gamma', datasets: 8 },
  { id: 'p5', name: 'Compliance Data Migration', status: 'running', progress: 45, team: 'Team Delta', datasets: 15 },
];

const statusStyles = {
  running: 'bg-success-50 text-success-500',
  queued: 'bg-warning-50 text-warning-500',
  completed: 'bg-primary-50 text-primary-500',
  failed: 'bg-error-50 text-error-500',
};

export const MigrationProjects = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-100">Migration Projects</h2>
        <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors">
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 'proj-active', label: 'Active Projects', value: 8 },
          { id: 'proj-completed', label: 'Completed', value: 12 },
          { id: 'proj-queued', label: 'Queued', value: 3 },
          { id: 'proj-health', label: 'Project Health', value: '95%' },
        ].map((kpi) => (
          <WidgetRenderer
            key={kpi.id}
            config={{ id: kpi.id, type: 'kpi', title: kpi.label, size: 'md' } as WidgetConfig}
            data={{ value: kpi.value, label: kpi.label }}
          />
        ))}
      </div>

      <div className="bg-white border border-neutral-30 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-30">
          <h3 className="text-sm font-semibold text-neutral-100">Project List</h3>
        </div>
        <div className="divide-y divide-neutral-30">
          {projects.map((project) => (
            <div key={project.id} className="p-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors cursor-pointer">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-100">{project.name}</p>
                <p className="text-xs text-neutral-60">{project.team} | {project.datasets} datasets</p>
              </div>
              <div className="w-24">
                <div className="h-2 bg-neutral-20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${project.progress}%` }} />
                </div>
                <p className="text-[10px] text-neutral-60 mt-1">{project.progress}%</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusStyles[project.status as keyof typeof statusStyles]}`}>
                {project.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
