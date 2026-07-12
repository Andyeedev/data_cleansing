import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { DashboardContextType, DashboardType, DashboardFilter } from './dashboard.types';

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
  initialDashboard?: DashboardType;
}

export const DashboardProvider = ({
  children,
  initialDashboard = 'executive',
}: DashboardProviderProps) => {
  const [currentDashboard, setCurrentDashboard] = useState<DashboardType>(initialDashboard);
  const [filters, setFilters] = useState<DashboardFilter[]>([]);
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const setFilter = useCallback((filterId: string, value: unknown) => {
    setFilters((prev) => {
      const existing = prev.find((f) => f.id === filterId);
      if (existing) {
        return prev.map((f) => (f.id === filterId ? { ...f, value } : f));
      }
      return [...prev, { id: filterId, label: filterId, type: 'dropdown' as const, value }];
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  const toggleWidget = useCallback((widgetId: string) => {
    setSelectedWidgets((prev) =>
      prev.includes(widgetId)
        ? prev.filter((id) => id !== widgetId)
        : [...prev, widgetId]
    );
  }, []);

  const refreshDashboard = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        currentDashboard,
        filters,
        selectedWidgets,
        refreshKey,
        isLoading,
        setCurrentDashboard,
        setFilter,
        clearFilters,
        toggleWidget,
        refreshDashboard,
        setLoading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
