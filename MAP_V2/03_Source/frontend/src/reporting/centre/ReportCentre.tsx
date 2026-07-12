import { useLocation } from 'react-router-dom';
import { ReportHome } from './ReportHome';
import { ReportExplorer } from './ReportExplorer';
import { RecentReports } from './RecentReports';
import { FavouriteReports } from './FavouriteReports';
import { ScheduledReports } from './ScheduledReports';
import { SharedReports } from './SharedReports';
import { MyReports } from './MyReports';
import { ReportTemplatesPage } from './ReportTemplates';
import { ReportCategories } from './ReportCategories';
import { ReportPreview } from './ReportPreview';
import { ReportHistory } from './ReportHistory';
import { ReportQueue } from './ReportQueue';
import { ReportSearch } from './ReportSearch';
import { ReportFilters } from './ReportFilters';
import { ReportDetails } from './ReportDetails';
import { ReportWorkspace } from './ReportWorkspace';
import { ReportCentreSidebar } from './ReportCentreSidebar';

const routeComponents: Record<string, React.ComponentType> = {
  '/report-centre': ReportHome,
  '/report-centre/explorer': ReportExplorer,
  '/report-centre/recent': RecentReports,
  '/report-centre/favourites': FavouriteReports,
  '/report-centre/scheduled': ScheduledReports,
  '/report-centre/shared': SharedReports,
  '/report-centre/my': MyReports,
  '/report-centre/templates': ReportTemplatesPage,
  '/report-centre/categories': ReportCategories,
  '/report-centre/preview': ReportPreview,
  '/report-centre/details': ReportDetails,
  '/report-centre/history': ReportHistory,
  '/report-centre/queue': ReportQueue,
  '/report-centre/search': ReportSearch,
  '/report-centre/filters': ReportFilters,
  '/report-centre/workspace': ReportWorkspace,
};

export const ReportCentre = () => {
  const location = useLocation();
  const PageComponent = routeComponents[location.pathname] || ReportHome;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <ReportCentreSidebar currentPath={location.pathname} />
      <main className="flex-1 p-6 overflow-auto">
        <PageComponent />
      </main>
    </div>
  );
};
