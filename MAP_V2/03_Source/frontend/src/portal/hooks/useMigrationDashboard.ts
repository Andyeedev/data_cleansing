import { useState, useCallback, useEffect } from 'react';
import type { MigrationMetrics } from '../types/MigrationMetrics';
import { defaultMigrationMetrics } from '../types/MigrationMetrics';

export const useMigrationDashboard = () => {
  const [metrics] = useState<MigrationMetrics>(defaultMigrationMetrics);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return { metrics, isLoading, error, refresh };
};
