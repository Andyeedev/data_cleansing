import type { ReactNode } from 'react';
import type { PortalDefinition } from '../types/PortalDefinition';
import { PortalHeader } from './PortalHeader';
import { PortalBreadcrumb } from './PortalBreadcrumb';
import { PortalFooter } from './PortalFooter';
import { Sidebar } from '../../layout/Sidebar';
import { StatusBar } from '../../layout/StatusBar';
import { EnvironmentBanner } from '../../layout/EnvironmentBanner';

interface PortalLayoutProps {
  portal: PortalDefinition;
  children: ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  showBreadcrumb?: boolean;
}

export const PortalLayout = ({
  portal,
  children,
  showSidebar = true,
  showHeader = true,
  showFooter = true,
  showBreadcrumb = true,
}: PortalLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-10">
      <EnvironmentBanner environment="development" />
      {showHeader && <PortalHeader portal={portal} />}
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <div className="flex-1 flex flex-col min-h-[calc(100vh-4rem)]">
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            {showBreadcrumb && <PortalBreadcrumb portal={portal} />}
            {children}
          </main>
          {showFooter && <PortalFooter portal={portal} />}
        </div>
      </div>
      <StatusBar />
    </div>
  );
};
