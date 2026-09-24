import type { LucideIcon } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import { LoadingSkeleton } from '../shared/LoadingSkeleton';

interface OnboardingCardProps {
  state: 'loading' | 'empty' | 'error' | 'content';
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: { label: string; onClick: () => void };
  error?: string;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function OnboardingCard({
  state,
  title,
  description,
  icon: Icon,
  action,
  error,
  onRetry,
  children,
}: OnboardingCardProps) {
  if (state === 'loading') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <LoadingSkeleton rows={3} variant="card" height={120} />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-5 shadow-sm">
        <div className="flex flex-col items-center text-center py-4">
          <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
          <h3 className="text-base font-bold text-gray-900 mb-1">Something went wrong</h3>
          <p className="text-sm text-gray-500 mb-4 max-w-xs">
            {error || 'Failed to load. Check your connection and try again.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
        <div className="flex flex-col items-center text-center py-4">
          {Icon && <Icon className="w-10 h-10 text-gray-300 mb-3" />}
          <h3 className="text-base font-bold text-gray-900 mb-1">{title || 'Nothing here yet'}</h3>
          {description && (
            <p className="text-sm text-gray-500 mb-4 max-w-xs">{description}</p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      {children}
    </div>
  );
}
