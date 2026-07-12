import { Calendar, Clock, Zap } from 'lucide-react';
import { useReportScheduler } from './hooks/useReportScheduler';

export const ScheduleTemplates = () => {
  const { templates } = useReportScheduler();

  const getFrequencyColor = (freq: string) => {
    switch (freq) {
      case 'daily': return 'bg-blue-100 text-blue-700';
      case 'weekly': return 'bg-purple-100 text-purple-700';
      case 'monthly': return 'bg-green-100 text-green-700';
      case 'quarterly': return 'bg-orange-100 text-orange-700';
      case 'annually': return 'bg-red-100 text-red-700';
      default: return 'bg-neutral-200 text-neutral-60';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Schedule Templates</h1>
        <p className="text-neutral-60">Reusable schedule templates for common report patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="bg-white border border-neutral-20 rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-neutral-100">{template.name}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getFrequencyColor(template.frequency)}`}>
                {template.frequency}
              </span>
            </div>
            <p className="text-sm text-neutral-60 mb-4">{template.description}</p>
            <div className="flex items-center gap-4 text-sm text-neutral-50 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{template.config.time || '08:00'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span className="capitalize">{template.priority}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-50">Used {template.usageCount} times</span>
              <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
