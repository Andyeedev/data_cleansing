import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { HtmlReportConfig, HtmlReportMetadata, HtmlReportNavigationItem } from '../shared/ReportTypes';

interface ReportContextValue {
  config: HtmlReportConfig | null;
  metadata: HtmlReportMetadata | null;
  navigation: HtmlReportNavigationItem[];
  activeSection: string | null;
  setActiveSection: (sectionId: string | null) => void;
}

const ReportContext = createContext<ReportContextValue | undefined>(undefined);

interface ReportProviderProps {
  config: HtmlReportConfig;
  metadata?: HtmlReportMetadata | null;
  navigation?: HtmlReportNavigationItem[];
  children: ReactNode;
}

export const ReportProvider: React.FC<ReportProviderProps> = ({
  config,
  metadata = null,
  navigation = [],
  children,
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const value: ReportContextValue = {
    config,
    metadata,
    navigation,
    activeSection,
    setActiveSection,
  };

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
};

export const useReport = (): ReportContextValue => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
};

export { ReportContext };
export type { ReportContextValue };
