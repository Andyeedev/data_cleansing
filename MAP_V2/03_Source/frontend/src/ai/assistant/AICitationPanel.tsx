import type { AICitation } from '../types/AIResponses';

export interface AICitationPanelProps {
  citations: AICitation[];
}

export const AICitationPanel: React.FC<AICitationPanelProps> = ({ citations }) => {
  if (citations.length === 0) return null;

  const getSourceTypeIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'report': return '📊';
      case 'dataset': return '💾';
      case 'audit': return '📋';
      case 'document': return '📄';
      default: return '🔗';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#22c55e';
    if (confidence >= 0.5) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{
      padding: '12px 16px',
      borderTop: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '8px'
      }}>
        <span style={{ fontSize: '12px' }}>📚</span>
        <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500 }}>
          Sources ({citations.length})
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {citations.map((citation) => (
          <div
            key={citation.id}
            style={{
              padding: '8px 10px',
              backgroundColor: '#ffffff',
              borderRadius: '6px',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px' }}>
                {getSourceTypeIcon(citation.sourceType)}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>
                {citation.title}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: '#6b7280', lineHeight: '1.4' }}>
              {citation.excerpt}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span style={{
                fontSize: '10px',
                padding: '2px 6px',
                backgroundColor: '#f3f4f6',
                borderRadius: '4px',
                color: '#6b7280'
              }}>
                {citation.source}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: getConfidenceColor(citation.confidence)
                }} />
                <span style={{ fontSize: '10px', color: '#9ca3af' }}>
                  {Math.round(citation.confidence * 100)}% confidence
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AICitationPanel;
