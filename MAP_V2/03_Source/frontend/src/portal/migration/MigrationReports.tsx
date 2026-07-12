import { BarChart3, FileText, ShieldCheck, TrendingUp, ClipboardList } from 'lucide-react';

const reports = [
  { id: 'r1', name: 'Migration Summary', description: 'Overall migration status and metrics', category: 'Executive', icon: BarChart3 },
  { id: 'r2', name: 'Project Status', description: 'Detailed project progress and timeline', category: 'Projects', icon: ClipboardList },
  { id: 'r3', name: 'Dataset Statistics', description: 'Dataset health, throughput, and performance', category: 'Data', icon: TrendingUp },
  { id: 'r4', name: 'Execution Reports', description: 'Run history, success rates, and failures', category: 'Execution', icon: FileText },
  { id: 'r5', name: 'Validation Reports', description: 'Rule execution results and exceptions', category: 'Validation', icon: ShieldCheck },
];

export const MigrationReports = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-neutral-100">Migration Reports</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-neutral-30 rounded-xl p-4 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <report.icon className="w-5 h-5 text-primary-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-100">{report.name}</p>
                <p className="text-xs text-neutral-60">{report.description}</p>
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 bg-neutral-20 rounded-full text-neutral-60">
                  {report.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
