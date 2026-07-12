import { useReportViewer } from './ReportViewerContext';
import { ViewerSidebarPanel } from './components/widgets/ViewerSidebarPanel';

export const ReportOutline = () => {
  const { reportConfig, activeSection, setActiveSection, setSidebarOpen } = useReportViewer();
  const sections = reportConfig?.sections?.filter((s) => s.visible !== false) ?? [];

  return (
    <ViewerSidebarPanel title="Table of Contents" onClose={() => setSidebarOpen(false)}>
      <nav aria-label="Report outline">
        <ul className="space-y-1">
          {sections.map((section, index) => (
            <li key={section.id}>
              <button
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-2 ${
                  activeSection === section.id
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-neutral-70 hover:bg-neutral-100 hover:text-neutral-100'
                }`}
                aria-current={activeSection === section.id ? 'location' : undefined}
              >
                <span className="text-xs text-neutral-40 w-6">{String(index + 1).padStart(2, '0')}</span>
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </ViewerSidebarPanel>
  );
};
