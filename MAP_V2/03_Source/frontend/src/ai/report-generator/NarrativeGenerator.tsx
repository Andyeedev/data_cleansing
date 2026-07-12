import { useState } from 'react';

interface Narrative {
  id: string;
  type: 'data-description' | 'trend-explanation' | 'insight-summary' | 'recommendation' | 'risk' | 'compliance';
  content: string;
  generatedAt: string;
}

const DEMO_NARRATIVES: Narrative[] = [
  {
    id: 'narr-001',
    type: 'data-description',
    content: 'The migration process has successfully transferred 2.4 million records from the legacy system to the new platform, representing a 94% completion rate. Data integrity checks show a 99.7% match rate across all migrated tables.',
    generatedAt: '2026-07-10T10:00:00Z',
  },
  {
    id: 'narr-002',
    type: 'trend-explanation',
    content: 'Over the past 30 days, migration throughput has increased by 35% due to the implementation of parallel processing. Error rates have decreased from 2.3% to 0.8%, indicating improved data quality and process stability.',
    generatedAt: '2026-07-10T09:30:00Z',
  },
  {
    id: 'narr-003',
    type: 'insight-summary',
    content: 'Key insights reveal that batch processing during off-peak hours yields 40% better performance. Tables with foreign key constraints require special handling, adding approximately 15% to processing time.',
    generatedAt: '2026-07-09T16:00:00Z',
  },
];

const NARRATIVE_TYPES = ['All', 'data-description', 'trend-explanation', 'insight-summary', 'recommendation', 'risk', 'compliance'];

const TYPE_LABELS: Record<string, string> = {
  'data-description': 'Data Description',
  'trend-explanation': 'Trend Explanation',
  'insight-summary': 'Insight Summary',
  recommendation: 'Recommendation',
  risk: 'Risk Narrative',
  compliance: 'Compliance Narrative',
};

const TYPE_COLORS: Record<string, string> = {
  'data-description': '#3b82f6',
  'trend-explanation': '#10b981',
  'insight-summary': '#8b5cf6',
  recommendation: '#f59e0b',
  risk: '#dc2626',
  compliance: '#06b6d4',
};

export function NarrativeGenerator() {
  const [narratives] = useState<Narrative[]>(DEMO_NARRATIVES);
  const [typeFilter, setTypeFilter] = useState('All');
  const [inputData, setInputData] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const filtered = typeFilter === 'All'
    ? narratives
    : narratives.filter(n => n.type === typeFilter);

  const handleGenerate = () => {
    if (!inputData.trim()) return;
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Narrative Generator</h2>

      <div style={{
        padding: '16px',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
      }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>
          Input data or context for narrative generation
        </label>
        <textarea
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder="e.g., Migration completed 94% of records with 99.7% integrity rate..."
          style={{
            width: '100%',
            minHeight: '80px',
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
          disabled={isGenerating || !inputData.trim()}
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
          {isGenerating ? 'Generating...' : 'Generate Narrative'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {NARRATIVE_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            style={{
              padding: '6px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              background: typeFilter === type ? '#3b82f6' : '#fff',
              color: typeFilter === type ? '#fff' : '#64748b',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            {type === 'All' ? 'All' : TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(narrative => (
          <div key={narrative.id} style={{
            padding: '16px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            borderLeft: `4px solid ${TYPE_COLORS[narrative.type]}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '500',
                color: '#fff',
                background: TYPE_COLORS[narrative.type],
              }}>
                {TYPE_LABELS[narrative.type]}
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                {new Date(narrative.generatedAt).toLocaleString()}
              </span>
            </div>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: 0 }}>{narrative.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NarrativeGenerator;
