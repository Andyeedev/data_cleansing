import { useState } from 'react';
import { InsightDashboard } from './InsightDashboard';
import { InsightExplorer } from './InsightExplorer';
import { PatternDetector } from './PatternDetector';
import { AnomalyDetector } from './AnomalyDetector';
import { TrendAnalyser } from './TrendAnalyser';
import { PredictiveEngine } from './PredictiveEngine';

export type InsightView = 'dashboard' | 'explorer' | 'patterns' | 'anomalies' | 'trends' | 'predictions';

export interface AIInsightsProps {
  defaultView?: InsightView;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ defaultView = 'dashboard' }) => {
  const [currentView, setCurrentView] = useState<InsightView>(defaultView);

  const navItems: { id: InsightView; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'explorer', label: 'Explorer', icon: '🔍' },
    { id: 'patterns', label: 'Patterns', icon: '🔄' },
    { id: 'anomalies', label: 'Anomalies', icon: '⚠️' },
    { id: 'trends', label: 'Trends', icon: '📈' },
    { id: 'predictions', label: 'Predictions', icon: '🔮' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '24px' }}>💡</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>AI Insights</h2>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
              Intelligent analysis and pattern detection
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={{
                padding: '8px 12px',
                backgroundColor: currentView === item.id ? '#eff6ff' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: currentView === item.id ? 500 : 400,
                color: currentView === item.id ? '#3b82f6' : '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#f9fafb' }}>
        {currentView === 'dashboard' && <InsightDashboard />}
        {currentView === 'explorer' && <InsightExplorer />}
        {currentView === 'patterns' && <PatternDetector />}
        {currentView === 'anomalies' && <AnomalyDetector />}
        {currentView === 'trends' && <TrendAnalyser />}
        {currentView === 'predictions' && <PredictiveEngine />}
      </div>
    </div>
  );
};

export default AIInsights;
