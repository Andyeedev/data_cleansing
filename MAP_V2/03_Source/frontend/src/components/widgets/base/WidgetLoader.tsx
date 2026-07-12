import type { WidgetLoaderProps } from '../types/WidgetProps';

export const WidgetLoader = ({
  message = 'Loading...',
  className = '',
}: WidgetLoaderProps) => {
  return (
    <div className={`flex items-center justify-center h-full min-h-[200px] ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-neutral-60">{message}</p>
      </div>
    </div>
  );
};
