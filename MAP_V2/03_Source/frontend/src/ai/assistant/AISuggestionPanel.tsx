import { useAIContext } from '../framework/AIContext';

export interface AISuggestionPanelProps {
  onSuggestionClick: (suggestion: string) => void;
}

const PORTAL_SUGGESTIONS: Record<string, string[]> = {
  executive: [
    'Summarise migration status',
    'Generate CIO report',
    'Explain highest risks'
  ],
  operations: [
    'Show pending validations',
    'Explain queue bottlenecks',
    'Recommend next actions'
  ],
  migration: [
    'Summarise migration progress',
    'Explain validation failures',
    'Predict completion date'
  ],
  governance: [
    'Show compliance status',
    'Explain policy violations',
    'Recommend remediation'
  ],
  reporting: [
    'Generate executive summary',
    'Explain report trends',
    'Create custom report'
  ],
  security: [
    'Show security events',
    'Explain threat patterns',
    'Recommend improvements'
  ],
  administration: [
    'Show platform health',
    'Explain configuration impact',
    'Recommend optimisations'
  ],
  copilot: [
    'How can you help me?',
    'What reports are available?',
    'Show my recent activity'
  ]
};

export const AISuggestionPanel: React.FC<AISuggestionPanelProps> = ({
  onSuggestionClick
}) => {
  const context = useAIContext();
  const portal = context.portal ?? 'copilot';
  const suggestions = PORTAL_SUGGESTIONS[portal] ?? PORTAL_SUGGESTIONS.copilot;

  return (
    <div style={{
      padding: '12px 16px',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '8px'
      }}>
        <span style={{ fontSize: '12px' }}>💡</span>
        <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500 }}>
          Suggested for {portal.charAt(0).toUpperCase() + portal.slice(1)}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            style={{
              padding: '6px 10px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              cursor: 'pointer',
              fontSize: '11px',
              color: '#374151',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#eff6ff';
              e.currentTarget.style.borderColor = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AISuggestionPanel;
