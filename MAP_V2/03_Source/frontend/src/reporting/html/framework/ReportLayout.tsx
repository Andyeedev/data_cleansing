import React from 'react';
import type { ReactNode } from 'react';
import { ReportHeader } from './ReportHeader';
import { ReportFooter } from './ReportFooter';
import { ReportNavigation } from './ReportNavigation';
import { useReport } from './ReportContext';

interface ReportLayoutProps {
  showNavigation?: boolean;
  children: ReactNode;
}

export const ReportLayout: React.FC<ReportLayoutProps> = ({
  showNavigation = true,
  children,
}) => {
  const { navigation } = useReport();
  const hasNavigation = showNavigation && navigation.length > 0;

  return (
    <div className="min-h-screen bg-white print:bg-white">
      <ReportHeader />

      <div className="flex max-w-7xl mx-auto">
        {hasNavigation && (
          <aside className="hidden lg:block w-64 flex-shrink-0 p-6 print:hidden">
            <div className="sticky top-6">
              <ReportNavigation />
            </div>
          </aside>
        )}

        <main
          className={`flex-1 ${hasNavigation ? 'lg:pl-6' : ''} p-6 print:p-0`}
          role="main"
        >
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </div>

      <ReportFooter />
    </div>
  );
};
