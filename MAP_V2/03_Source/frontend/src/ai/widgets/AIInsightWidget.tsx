import React from 'react';

export interface AIInsightWidgetProps {
  title?: string;
  insights?: string[];
}

export const AIInsightWidget: React.FC<AIInsightWidgetProps> = ({
  title = 'AI Insights',
  insights = []
}) => {
  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>
        {title}
      </h4>
      {insights.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
          No insights available. AI analysis pending.
        </p>
      ) : (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {insights.map((insight, index) => (
            <li
              key={index}
              style={{
                padding: '8px 0',
                borderBottom: index < insights.length - 1 ? '1px solid #f3f4f6' : 'none',
                fontSize: '13px',
                color: '#374151'
              }}
            >
              {insight}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AIInsightWidget;
