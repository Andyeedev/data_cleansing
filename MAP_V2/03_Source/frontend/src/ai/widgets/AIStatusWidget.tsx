import React from 'react';
import { useAI } from '../hooks/useAI';
import { useAIRegistry } from '../hooks/useAIRegistry';

export interface AIStatusWidgetProps {
  compact?: boolean;
}

export const AIStatusWidget: React.FC<AIStatusWidgetProps> = ({ compact = false }) => {
  const { isLoading, error, quotaStatus } = useAI();
  const { enabledModules } = useAIRegistry();

  const getStatusColor = (): string => {
    if (error) return '#ef4444';
    if (isLoading) return '#f59e0b';
    return '#22c55e';
  };

  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: '#f9fafb',
        borderRadius: '6px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: getStatusColor()
        }} />
        <span style={{ fontSize: '13px', color: '#374151' }}>
          {isLoading ? 'Processing...' : error ? 'Error' : 'AI Ready'}
        </span>
        <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: 'auto' }}>
          {enabledModules.length} modules
        </span>
      </div>
    );
  }

  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>
        AI Status
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>Status</span>
          <span style={{ fontSize: '13px', color: getStatusColor(), fontWeight: 500 }}>
            {isLoading ? 'Processing...' : error ? 'Error' : 'Ready'}
          </span>
        </div>
        {quotaStatus && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Requests/min</span>
              <span style={{ fontSize: '13px', color: '#374151' }}>
                {quotaStatus.usage.requestsLastMinute}/{quotaStatus.limits.requestsPerMinute}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Tokens today</span>
              <span style={{ fontSize: '13px', color: '#374151' }}>
                {quotaStatus.usage.tokensLastDay.toLocaleString()}
              </span>
            </div>
          </>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>Active Modules</span>
          <span style={{ fontSize: '13px', color: '#374151' }}>
            {enabledModules.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIStatusWidget;
