import React from 'react';

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface AIRecommendationWidgetProps {
  recommendations?: AIRecommendation[];
  onRecommendationClick?: (recommendation: AIRecommendation) => void;
}

export const AIRecommendationWidget: React.FC<AIRecommendationWidgetProps> = ({
  recommendations = [],
  onRecommendationClick
}) => {
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>
        AI Recommendations
      </h4>
      {recommendations.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
          No recommendations available.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              onClick={() => onRecommendationClick?.(rec)}
              style={{
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                cursor: onRecommendationClick ? 'pointer' : 'default',
                border: '1px solid #f3f4f6'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: getPriorityColor(rec.priority)
                }} />
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                  {rec.title}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                {rec.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIRecommendationWidget;
