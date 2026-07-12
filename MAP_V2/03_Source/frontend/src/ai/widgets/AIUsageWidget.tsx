import React from 'react';
import { useAIUsage } from '../hooks/useAIUsage';

export interface AIUsageWidgetProps {
  compact?: boolean;
}

export const AIUsageWidget: React.FC<AIUsageWidgetProps> = ({ compact = false }) => {
  const { summary, isLoading } = useAIUsage();

  if (isLoading || !summary) {
    return (
      <div style={{
        padding: '16px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <span style={{ fontSize: '13px', color: '#9ca3af' }}>Loading usage data...</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 12px',
        backgroundColor: '#f9fafb',
        borderRadius: '6px',
        border: '1px solid #e5e7eb'
      }}>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>
          {summary.totalRequests} requests
        </span>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>
          {summary.totalTokens.toLocaleString()} tokens
        </span>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>
          ${summary.totalCost.toFixed(2)}
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
        AI Usage
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>Total Requests</span>
          <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>
            {summary.totalRequests}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>Total Tokens</span>
          <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>
            {summary.totalTokens.toLocaleString()}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>Estimated Cost</span>
          <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>
            ${summary.totalCost.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIUsageWidget;
