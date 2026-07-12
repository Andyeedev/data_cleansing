import type { WidgetFooterProps } from './dashboard.types';

export const WidgetFooter = ({ children, className = '' }: WidgetFooterProps) => {
  if (!children) return null;

  return (
    <div className={`px-4 py-2 border-t border-neutral-30 bg-neutral-20 ${className}`}>
      {children}
    </div>
  );
};
