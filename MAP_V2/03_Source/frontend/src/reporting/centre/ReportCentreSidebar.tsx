import { reportCentreNavigation } from './ReportCentreNavigation';

interface ReportCentreSidebarProps {
  currentPath: string;
}

export const ReportCentreSidebar: React.FC<ReportCentreSidebarProps> = ({ currentPath }) => {
  return (
    <aside className="hidden md:block w-64 bg-neutral-5 border-r border-neutral-20 p-4">
      <h2 className="text-sm font-semibold text-neutral-80 uppercase tracking-wide mb-4 px-3">
        Report Centre
      </h2>
      <nav>
        <ul className="space-y-1">
          {reportCentreNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <li key={item.id}>
                <a
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-neutral-70 hover:bg-neutral-100 hover:text-neutral-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
