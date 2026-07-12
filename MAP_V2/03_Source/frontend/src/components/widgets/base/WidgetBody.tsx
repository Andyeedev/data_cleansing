import type { WidgetBodyProps } from '../types/WidgetProps';

export const WidgetBody = ({ children, className = '' }: WidgetBodyProps) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};
