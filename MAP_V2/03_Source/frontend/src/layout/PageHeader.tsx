interface PageHeaderProps {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  actions?: React.ReactNode;
}

export const PageHeader = ({
  title,
  subtitle,
  lastUpdated,
  actions,
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-100">{title}</h1>
        {subtitle && (
          <p className="text-neutral-60 mt-1">{subtitle}</p>
        )}
        {lastUpdated && (
          <p className="text-sm text-neutral-60 mt-1">Last updated: {lastUpdated}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};
