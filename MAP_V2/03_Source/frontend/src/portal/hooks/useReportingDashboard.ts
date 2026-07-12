import { useState, useCallback } from 'react';
import type { ReportingMetrics } from '../types/ReportingMetrics';

interface UseReportingDashboardReturn {
  metrics: ReportingMetrics | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const generateMockMetrics = (): ReportingMetrics => ({
  reportsGenerated: 1247,
  scheduledReports: 34,
  failedReports: 3,
  pendingReports: 12,
  reportUsage: 856,
  exportActivity: 423,
  aiReportSummary: 'Report generation is healthy. 3 reports failed due to timeout. 12 reports pending for next scheduled run. Consider optimising the Executive Dashboard Report query.',
  generationTrend: [120, 135, 142, 128, 156, 148, 165],
  usageTrend: [85, 92, 78, 95, 88, 102, 98],
  categoryBreakdown: {
    executive: 18,
    operational: 25,
    migration: 20,
    validation: 15,
    governance: 12,
    audit: 8,
    regulatory: 10,
    scheduled: 34,
  },
});

export const useReportingDashboard = (): UseReportingDashboardReturn => {
  const [metrics, setMetrics] = useState<ReportingMetrics | null>(null);
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
        setError('Failed to load reporting data');
        setIsLoading(false);
      }
    }, 500);
  }, []);

  if (!metrics && !isLoading && !error) {
    refresh();
  }

  return { metrics, isLoading, error, refresh };
};
