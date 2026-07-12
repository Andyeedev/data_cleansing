import { EnvironmentBanner } from './EnvironmentBanner';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Breadcrumb } from './Breadcrumb';
import { StatusBar } from './StatusBar';
import { LoadingOverlay } from './LoadingOverlay';

interface ApplicationShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  isLoading?: boolean;
}

export const ApplicationShell = ({
  children,
  showSidebar = true,
  isLoading = false,
}: ApplicationShellProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-10">
      <EnvironmentBanner environment="development" />
      <Header />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <div className="flex-1 flex flex-col min-h-[calc(100vh-4rem)]">
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <Breadcrumb />
            {children}
          </main>
          <Footer />
        </div>
      </div>
      <StatusBar />
      {isLoading && <LoadingOverlay />}
    </div>
  );
};
