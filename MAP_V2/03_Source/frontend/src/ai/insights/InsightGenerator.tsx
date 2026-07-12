import { useAIContext } from '../framework/AIContext';

export interface InsightGeneratorProps {
  onInsightGenerated?: (insight: string) => void;
}

export const InsightGenerator: React.FC<InsightGeneratorProps> = ({ onInsightGenerated }) => {
  const context = useAIContext();

  const handleGenerate = (type: string) => {
    const demoInsights: Record<string, string> = {
      executive: 'Executive Summary: Migration is 78% complete with 3 days remaining. Budget is on track at $45,200 projected spend.',
      migration: 'Migration Analysis: 97,500 records migrated successfully. 5,000 records failed validation and require remediation.',
      validation: 'Validation Insights: Error rate increased to 12% due to schema mismatch in Transaction table. Recommend immediate review.',
      risk: 'Risk Assessment: Overall risk is Medium (65/100). Top concerns: data quality issues, resource constraints, timeline pressure.',
      governance: 'Governance Review: 3 policies require review. Compliance score is 94%. Next audit scheduled in 14 days.',
      security: 'Security Analysis: Unusual login pattern detected from IP 192.168.1.100. Recommend investigation.'
    };

    onInsightGenerated?.(demoInsights[type] ?? 'Generating insight...');
  };

  return (
    <div style={{
      padding: '12px 16px',
      borderTop: '1px solid #e5e7eb',
      backgroundColor: '#ffffff'
    }}>
      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
        Generate Insight for: {context.portal ?? 'General'}
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {['executive', 'migration', 'validation', 'risk', 'governance', 'security'].map((type) => (
          <button
            key={type}
            onClick={() => handleGenerate(type)}
            style={{
              padding: '6px 10px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '11px',
              textTransform: 'capitalize'
            }}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InsightGenerator;
