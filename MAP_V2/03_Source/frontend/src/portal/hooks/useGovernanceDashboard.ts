import { useState, useCallback } from 'react';
import type { GovernanceMetrics } from '../types/GovernanceMetrics';

interface UseGovernanceDashboardReturn {
  metrics: GovernanceMetrics | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const generateMockMetrics = (): GovernanceMetrics => ({
  overallComplianceScore: 94.2,
  policyCompliance: 96.8,
  activeExceptions: 12,
  auditFindings: 8,
  governanceHealth: 91.5,
  controlEffectiveness: 93.7,
  aiGovernanceSummary: 'Governance posture is strong. 3 policies due for review. 2 high-severity exceptions pending resolution.',
  complianceTrend: [88, 89, 90, 91, 92, 93, 94],
  riskTrend: [15, 14, 13, 12, 11, 10, 9],
  auditTrend: [5, 6, 4, 7, 3, 4, 2],
});

export const useGovernanceDashboard = (): UseGovernanceDashboardReturn => {
  const [metrics, setMetrics] = useState<GovernanceMetrics | null>(null);
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
        setError('Failed to load governance data');
        setIsLoading(false);
      }
    }, 500);
  }, []);

  if (!metrics && !isLoading && !error) {
    refresh();
  }

  return { metrics, isLoading, error, refresh };
};
