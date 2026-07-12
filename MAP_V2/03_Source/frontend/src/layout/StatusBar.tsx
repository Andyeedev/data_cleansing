import { Wifi } from 'lucide-react';

export const StatusBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-30 px-4 py-2 z-20 hidden lg:block">
      <div className="flex items-center justify-between text-xs text-neutral-60">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Wifi className="w-3 h-3 text-success-500" />
            <span>Connected</span>
          </div>
          <span>|</span>
          <span>Environment: Development</span>
        </div>
        <div className="flex items-center gap-4">
          <span>MAP Nexus™ v2.0</span>
          <span>|</span>
          <a href="/help" className="hover:text-primary-500 transition-colors">
            Help
          </a>
        </div>
      </div>
    </div>
  );
};
