interface DashboardAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

interface DashboardActionsProps {
  actions: DashboardAction[];
  className?: string;
}

const variantClasses = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 border-primary-500',
  secondary: 'bg-white text-neutral-100 hover:bg-neutral-20 border-neutral-30',
  ghost: 'bg-transparent text-neutral-60 hover:bg-neutral-20 border-transparent',
};

export const DashboardActions = ({ actions, className = '' }: DashboardActionsProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            variantClasses[action.variant || 'secondary']
          }`}
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </div>
  );
};
