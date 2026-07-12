import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import type { PortalDefinition } from '../types/PortalDefinition';

interface PortalErrorProps {
  error: string;
  portal?: PortalDefinition;
  onRetry?: () => void;
  onNavigateHome?: () => void;
}

export const PortalError = ({ error, portal, onRetry, onNavigateHome }: PortalErrorProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-10">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-error-500" />
        </div>

        <h2 className="text-xl font-semibold text-neutral-100 mb-2">
          {portal ? `${portal.name} Error` : 'Portal Error'}
        </h2>

        <p className="text-neutral-60 mb-6">{error}</p>

        <div className="flex items-center justify-center gap-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          )}

          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-20 text-neutral-100 rounded-lg hover:bg-neutral-30 transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
