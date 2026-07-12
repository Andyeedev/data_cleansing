import { FileText, Copy } from 'lucide-react';

const templates = [
  { id: 't1', name: 'Executive Report Template', description: 'Standard executive summary report', category: 'executive', usageCount: 24 },
  { id: 't2', name: 'Migration Report Template', description: 'Migration progress and metrics', category: 'migration', usageCount: 18 },
  { id: 't3', name: 'Validation Report Template', description: 'Data validation results', category: 'validation', usageCount: 12 },
  { id: 't4', name: 'Governance Report Template', description: 'Policy compliance report', category: 'governance', usageCount: 8 },
  { id: 't5', name: 'Risk Report Template', description: 'Risk assessment and mitigation', category: 'risk', usageCount: 15 },
  { id: 't6', name: 'Security Report Template', description: 'Security audit and events', category: 'security', usageCount: 10 },
  { id: 't7', name: 'Administration Report Template', description: 'Platform administration status', category: 'administration', usageCount: 6 },
  { id: 't8', name: 'Audit Trail Template', description: 'Complete audit log report', category: 'audit', usageCount: 9 },
  { id: 't9', name: 'AI Insights Template', description: 'AI-generated insights report', category: 'ai', usageCount: 5 },
];

export const ReportTemplatesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">Report Templates</h1>
        <p className="text-neutral-60">Reusable templates for generating reports</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="bg-white border border-neutral-20 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <FileText className="w-8 h-8 text-primary-500" />
              <button className="text-neutral-40 hover:text-primary-500">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-medium text-neutral-100 mb-1">{template.name}</h3>
            <p className="text-sm text-neutral-60 mb-3">{template.description}</p>
            <div className="flex items-center justify-between text-xs text-neutral-50">
              <span className="capitalize">{template.category}</span>
              <span>Used {template.usageCount} times</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
