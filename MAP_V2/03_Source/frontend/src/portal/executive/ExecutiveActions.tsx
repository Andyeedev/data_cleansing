import { BarChart3, Play, Bot, ShieldCheck, ClipboardList, FileText } from 'lucide-react';

interface ExecutiveActionsProps {
  onAction?: (actionId: string) => void;
}

const actions = [
  { id: 'view-reports', label: 'View Reports', icon: BarChart3, color: 'bg-primary-50 text-primary-500' },
  { id: 'run-validation', label: 'Run Validation', icon: Play, color: 'bg-success-50 text-success-500' },
  { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, color: 'bg-purple-50 text-purple-500' },
  { id: 'review-risks', label: 'Review Risks', icon: ShieldCheck, color: 'bg-warning-50 text-warning-500' },
  { id: 'programme-status', label: 'Programme Status', icon: ClipboardList, color: 'bg-info-50 text-info-500' },
  { id: 'audit-centre', label: 'Audit Centre', icon: FileText, color: 'bg-neutral-20 text-neutral-70' },
];

export const ExecutiveActions = ({ onAction }: ExecutiveActionsProps) => {
  return (
    <div className="bg-white border border-neutral-30 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-neutral-100 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction?.(action.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border border-neutral-30 hover:border-primary-300 hover:shadow-sm transition-all ${action.color}`}
          >
            <action.icon className="w-6 h-6" />
            <span className="text-xs font-medium text-neutral-100">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
