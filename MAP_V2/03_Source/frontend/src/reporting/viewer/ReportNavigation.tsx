import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useReportViewer } from './ReportViewerContext';

export const ReportNavigation = () => {
  const { reportConfig, setActiveSection, currentPages, setCurrentPages } = useReportViewer();

  const sections = reportConfig?.sections?.filter((s) => s.visible !== false) ?? [];
  const currentIndex = sections.findIndex((s) => s.id === currentPages.current.toString());

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevSection = sections[currentIndex - 1];
      setActiveSection(prevSection.id);
      setCurrentPages({ ...currentPages, current: currentIndex });
    }
  };

  const goToNext = () => {
    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      setActiveSection(nextSection.id);
      setCurrentPages({ ...currentPages, current: currentIndex + 2 });
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-neutral-5 border-t border-neutral-200 print:hidden">
      <button
        onClick={goToPrevious}
        disabled={currentIndex <= 0}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-neutral-70 hover:bg-neutral-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous Section
      </button>

      <div className="flex items-center gap-2 text-sm text-neutral-60">
        <Home className="w-4 h-4" />
        <span>
          Section {currentIndex + 1} of {sections.length}
        </span>
      </div>

      <button
        onClick={goToNext}
        disabled={currentIndex >= sections.length - 1}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-neutral-70 hover:bg-neutral-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next Section
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
