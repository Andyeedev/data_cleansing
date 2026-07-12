import { useState, useCallback } from 'react';
import type { AdminMetrics } from '../types/AdminMetrics';

interface UseAdminDashboardReturn {
  metrics: AdminMetrics | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const generateMockMetrics = (): AdminMetrics => ({
  activeUsers: 1247,
  activeTenants: 18,
  organisations: 42,
  activeSessions: 234,
  scheduledJobs: 34,
  platformHealth: 98.7,
  licenceUsage: 82.3,
  featureStatus: 95.1,
  systemAlerts: '2 warnings: 3 licences expiring in 30 days, 1 tenant approaching user limit',
  healthTrend: [97.5, 98.0, 98.2, 98.5, 98.3, 98.7, 98.7],
  userTrend: [1180, 1195, 1210, 1225, 1235, 1240, 1247],
  tenantTrend: [15, 15, 16, 16, 17, 17, 18],
});

export const useAdminDashboard = (): UseAdminDashboardReturn => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      try {
        setMetrics(generateMockMetrics());
        setIsLoading(false);
      } catch {
        setError('Failed to load administration data');
        setIsLoading(false);
      }
    }, 500);
  }, []);

  if (!metrics && !isLoading && !error) {
    refresh();
  }

  return { metrics, isLoading, error, refresh };
};
