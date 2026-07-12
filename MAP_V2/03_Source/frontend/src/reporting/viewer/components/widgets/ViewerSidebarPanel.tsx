import React from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ViewerSidebarPanelProps {
  title: string;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
}

export const ViewerSidebarPanel: React.FC<ViewerSidebarPanelProps> = ({
  title,
  onClose,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-20">
        <h3 className="text-sm font-semibold text-neutral-80">{title}</h3>
        {onClose && (
          <button onClick={onClose} className="p-1 text-neutral-50 hover:text-neutral-70 rounded" aria-label="Close panel">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  );
};
