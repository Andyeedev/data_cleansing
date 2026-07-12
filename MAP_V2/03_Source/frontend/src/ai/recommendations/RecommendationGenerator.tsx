import { useState } from 'react';

interface GeneratedRecommendation {
  id: string;
  title: string;
  category: string;
  priority: string;
  confidence: number;
  reasoning: string;
  actionable: boolean;
}

export function RecommendationGenerator() {
  const [context, setContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecs, setGeneratedRecs] = useState<GeneratedRecommendation[]>([]);

  const handleGenerate = () => {
    if (!context.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      setGeneratedRecs([
        {
          id: 'gen-001',
          title: 'Implement batch validation checkpoints',
          category: 'Migration',
          priority: 'high',
          confidence: 92,
          reasoning: 'Based on your migration context, adding validation checkpoints will prevent data corruption.',
          actionable: true,
        },
        {
          id: 'gen-002',
          title: 'Schedule migrations during off-peak hours',
          category: 'Optimization',
          priority: 'medium',
          confidence: 87,
          reasoning: 'Reducing peak load will improve performance and reduce risk.',
          actionable: true,
        },
        {
          id: 'gen-003',
          title: 'Add monitoring for batch processing jobs',
          category: 'Workflow',
          priority: 'medium',
          confidence: 78,
          reasoning: 'Monitoring will help identify issues before they impact operations.',
          actionable: true,
        },
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Recommendation Generator</h2>

      <div style={{
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
      }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>
          Describe your context or challenge
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g., I'm migrating 50GB of data from PostgreSQL to MySQL and need to ensure data integrity..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '14px',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !context.trim()}
          style={{
            marginTop: '12px',
            padding: '10px 20px',
            background: isGenerating ? '#94a3b8' : '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          {isGenerating ? 'Generating...' : 'Generate Recommendations'}
        </button>
      </div>

      {generatedRecs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>Generated Recommendations</h3>
          {generatedRecs.map(rec => (
            <div key={rec.id} style={{
              padding: '16px',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{rec.title}</h4>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    background: '#e0f2fe',
                    color: '#0369a1',
                  }}>
                    {rec.confidence}% confidence
                  </span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    background: '#f0fdf4',
                    color: '#166534',
                  }}>
                    {rec.category}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px 0' }}>{rec.reasoning}</p>
              <div style={{ fontSize: '12px', color: rec.actionable ? '#10b981' : '#f59e0b' }}>
                {rec.actionable ? '✓ Actionable' : '⚠ Requires review'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecommendationGenerator;
