import React from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface ReportSectionProps {
  id?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  visible?: boolean;
  className?: string;
  children: ReactNode;
}

export const ReportSection: React.FC<ReportSectionProps> = ({
  id,
  title,
  description,
  icon: Icon,
  visible = true,
  className = '',
  children,
}) => {
  if (!visible) return null;

  return (
    <section
      id={id}
      className={`mb-8 print:break-inside-avoid ${className}`}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <div className="border-l-4 border-primary-500 pl-4 mb-4">
        <h2
          id={id ? `${id}-heading` : undefined}
          className="text-2xl font-semibold text-neutral-100 flex items-center gap-2"
        >
          {Icon && <Icon className="w-6 h-6 text-primary-500" />}
          {title}
        </h2>
        {description && <p className="text-neutral-60 mt-1">{description}</p>}
      </div>
      <div className="pl-4">{children}</div>
    </section>
  );
};
