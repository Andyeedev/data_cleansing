import type { PortalDefinition } from '../types/PortalDefinition';

interface PortalLoaderProps {
  message?: string;
  portal?: PortalDefinition;
}

export const PortalLoader = ({ message, portal }: PortalLoaderProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-10">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-neutral-100 mb-2">
          {message || `Loading ${portal?.name || 'Portal'}...`}
        </h2>
        <p className="text-sm text-neutral-60">
          Please wait while we prepare your workspace
        </p>
      </div>
    </div>
  );
};
