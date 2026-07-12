import { Settings2, Bell, RefreshCw } from 'lucide-react';

interface OperationsHeaderProps {
  onRefresh?: () => void;
}

export const OperationsHeader = ({ onRefresh }: OperationsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
          <Settings2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-neutral-100">Operations Portal</h1>
          <p className="text-xs text-neutral-60">Real-time operational workspace</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-neutral-20 rounded-md transition-colors"
          aria-label="Refresh"
        >
          <RefreshCw className="w-4 h-4 text-neutral-60" />
        </button>
        <button
          className="p-2 hover:bg-neutral-20 rounded-md transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-neutral-60" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full" />
        </button>
      </div>
    </div>
  );
};
