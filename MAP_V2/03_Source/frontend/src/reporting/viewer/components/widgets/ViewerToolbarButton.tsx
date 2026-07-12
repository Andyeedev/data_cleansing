import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ViewerToolbarButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ViewerToolbarButton: React.FC<ViewerToolbarButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  active = false,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm transition-colors ${
        active
          ? 'bg-primary-50 text-primary-700 font-medium'
          : 'text-neutral-70 hover:bg-neutral-10 hover:text-neutral-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
};
