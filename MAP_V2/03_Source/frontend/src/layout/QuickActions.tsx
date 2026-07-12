import { FileText, Download, RefreshCw, HelpCircle, Bot } from 'lucide-react';

const actions = [
  { label: 'Generate Report', icon: FileText, onClick: () => {} },
  { label: 'Export', icon: Download, onClick: () => {} },
  { label: 'Refresh', icon: RefreshCw, onClick: () => {} },
  { label: 'Help', icon: HelpCircle, onClick: () => {} },
  { label: 'AI Assistant', icon: Bot, onClick: () => {} },
];

export const QuickActions = () => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-neutral-60 hover:text-neutral-100 hover:bg-neutral-20 border border-neutral-30 rounded-lg transition-colors"
          title={action.label}
        >
          <action.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{action.label}</span>
        </button>
      ))}
    </div>
  );
};
