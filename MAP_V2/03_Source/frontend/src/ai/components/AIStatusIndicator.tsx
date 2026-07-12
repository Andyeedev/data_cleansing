import React from 'react';
import { useAI } from '../hooks/useAI';

export interface AIStatusIndicatorProps {
  showDetails?: boolean;
}

export const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({ showDetails = false }) => {
  const { isLoading, error, quotaStatus } = useAI();

  const getStatusColor = (): string => {
    if (error) return '#ef4444';
    if (isLoading) return '#f59e0b';
    if (quotaStatus && !quotaStatus.withinLimits) return '#ef4444';
    return '#22c55e';
  };

  const getStatusText = (): string => {
    if (error) return 'Error';
    if (isLoading) return 'Processing...';
    if (quotaStatus && !quotaStatus.withinLimits) return 'Quota Exceeded';
    return 'Ready';
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: getStatusColor()
        }}
      />
      <span style={{ fontSize: '12px', color: '#6b7280' }}>
        AI: {getStatusText()}
      </span>
      {showDetails && quotaStatus && (
        <span style={{ fontSize: '11px', color: '#9ca3af' }}>
          ({quotaStatus.usage.requestsLastMinute}/{quotaStatus.limits.requestsPerMinute} req/min)
        </span>
      )}
    </div>
  );
};

export default AIStatusIndicator;
