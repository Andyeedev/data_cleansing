import { BarChart3, FileText, ShieldCheck, TrendingUp, ClipboardList, AlertTriangle } from 'lucide-react';

const defaultReports = [
  { id: 'r1', name: 'Executive Dashboard', description: 'High-level programme overview', category: 'Executive', icon: BarChart3 },
  { id: 'r2', name: 'Operational Dashboard', description: 'Detailed operational metrics', category: 'Operational', icon: ClipboardList },
  { id: 'r3', name: 'Audit Pack', description: 'Complete audit trail and findings', category: 'Governance', icon: ShieldCheck },
  { id: 'r4', name: 'Migration Health', description: 'Migration health score and trends', category: 'Executive', icon: TrendingUp },
  { id: 'r5', name: 'Compliance Summary', description: 'Regulatory compliance status', category: 'Governance', icon: FileText },
  { id: 'r6', name: 'Risk Report', description: 'Risk assessment and mitigation status', category: 'Risk', icon: AlertTriangle },
];

export const ExecutiveReports = () => {
  return (
    <div className="bg-white border border-neutral-30 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-neutral-100 mb-4">Executive Reports</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {defaultReports.map((report) => (
          <div
            key={report.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-neutral-30 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <report.icon className="w-4 h-4 text-primary-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-neutral-100">{report.name}</p>
              <p className="text-[10px] text-neutral-60">{report.description}</p>
              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-neutral-20 rounded-full text-neutral-60">
                {report.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
