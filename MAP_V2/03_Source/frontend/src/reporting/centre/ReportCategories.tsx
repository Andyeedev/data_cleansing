import { Folder, FileText, BarChart3, Shield, AlertTriangle, Settings, Brain, CheckCircle } from 'lucide-react';
import { useReportCentre } from './hooks/useReportCentre';

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  executive: BarChart3,
  migration: Folder,
  validation: CheckCircle,
  governance: Shield,
  risk: AlertTriangle,
  security: Shield,
  administration: Settings,
  audit: FileText,
  ai: Brain,
};

const categoryColours: Record<string, string> = {
  executive: 'bg-primary-50 border-primary-200 text-primary-700',
  migration: 'bg-success-50 border-success-200 text-success-700',
  validation: 'bg-information-50 border-information-200 text-information-700',
  governance: 'bg-warning-50 border-warning-200 text-warning-700',
  risk: 'bg-error-50 border-error-200 text-error-700',
  security: 'bg-neutral-50 border-neutral-200 text-neutral-700',
  administration: 'bg-neutral-50 border-neutral-200 text-neutral-700',
  audit: 'bg-neutral-50 border-neutral-200 text-neutral-700',
  ai: 'bg-primary-50 border-primary-200 text-primary-700',
};

export const ReportCategories = () => {
  const { reportsByCategory } = useReportCentre();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Report Categories</h1>
        <p className="text-neutral-60">Browse reports by category</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(reportsByCategory).map(([category, reports]) => {
          const Icon = categoryIcons[category] ?? FileText;
          return (
            <div
              key={category}
              className={`border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer ${categoryColours[category]}`}
            >
              <Icon className="w-8 h-8 mb-3" />
              <h3 className="font-semibold text-lg capitalize mb-1">{category}</h3>
              <p className="text-sm opacity-75">{reports.length} reports</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
