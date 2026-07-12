import { useState, useCallback } from 'react';
import type { SecurityMetrics } from '../types/SecurityMetrics';

interface UseSecurityDashboardReturn {
  metrics: SecurityMetrics | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const generateMockMetrics = (): SecurityMetrics => ({
  securityHealthScore: 87.5,
  activeSessions: 234,
  failedLogins: 12,
  mfaAdoption: 94.2,
  credentialStatus: 98.1,
  certificateStatus: 95.7,
  encryptionStatus: 100,
  complianceStatus: 92.3,
  threatSummary: 'Security posture is strong. 2 high-severity events detected in last 24 hours. All credentials rotated within policy. 3 certificates expiring within 30 days.',
  healthTrend: [82, 84, 85, 86, 87, 88, 87],
  threatTrend: [5, 3, 4, 2, 3, 1, 2],
  eventTrend: [45, 52, 38, 61, 42, 55, 48],
});

export const useSecurityDashboard = (): UseSecurityDashboardReturn => {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
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
        setError('Failed to load security data');
        setIsLoading(false);
      }
    }, 500);
  }, []);

  if (!metrics && !isLoading && !error) {
    refresh();
  }

  return { metrics, isLoading, error, refresh };
};
