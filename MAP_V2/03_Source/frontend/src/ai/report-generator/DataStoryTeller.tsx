import { useState } from 'react';

interface DataStory {
  id: string;
  title: string;
  type: 'executive' | 'operational' | 'migration' | 'governance' | 'security' | 'technical';
  audience: string;
  content: string;
  keyPoints: string[];
}

const DEMO_STORIES: DataStory[] = [
  {
    id: 'story-001',
    title: 'Migration Success Story',
    type: 'executive',
    audience: 'C-Suite',
    content: 'Our migration initiative has achieved remarkable results, surpassing initial targets by 15%. The team successfully migrated 2.4 million records with 99.7% data integrity, completing the project 2 weeks ahead of schedule.',
    keyPoints: ['94% completion rate', '99.7% data integrity', '2 weeks ahead of schedule', '40% cost savings'],
  },
  {
    id: 'story-002',
    title: 'Operational Efficiency gains',
    type: 'operational',
    audience: 'Operations Team',
    content: 'Process automation has reduced manual intervention by 60%, freeing up valuable team resources. Average processing time decreased from 4.2 hours to 1.8 hours per batch.',
    keyPoints: ['60% reduction in manual work', '57% faster processing', 'Zero data loss incidents'],
  },
  {
    id: 'story-003',
    title: 'Security Posture Improvement',
    type: 'security',
    audience: 'Security Team',
    content: 'Implementation of enhanced security controls has reduced vulnerability exposure by 75%. All critical vulnerabilities have been remediated within SLA.',
    keyPoints: ['75% reduction in vulnerabilities', '100% SLA compliance', 'MFA enabled for all admins'],
  },
];

const TYPE_COLORS: Record<string, string> = {
  executive: '#8b5cf6',
  operational: '#3b82f6',
  migration: '#10b981',
  governance: '#f59e0b',
  security: '#dc2626',
  technical: '#6366f1',
};

export function DataStoryTeller() {
  const [stories] = useState<DataStory[]>(DEMO_STORIES);
  const [selectedStory, setSelectedStory] = useState<DataStory | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Data Story Teller</h2>

      <div style={{ display: 'grid', gridTemplateColumns: selectedStory ? '1fr 1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {stories.map(story => (
            <div
              key={story.id}
              onClick={() => setSelectedStory(story)}
              style={{
                padding: '16px',
                background: selectedStory?.id === story.id ? '#eff6ff' : '#fff',
                border: `1px solid ${selectedStory?.id === story.id ? '#3b82f6' : '#e2e8f0'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                borderLeft: `4px solid ${TYPE_COLORS[story.type]}`,
              }}
            >
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '0 0 4px 0' }}>{story.title}</h3>
              <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: `${TYPE_COLORS[story.type]}20`,
                  color: TYPE_COLORS[story.type],
                  textTransform: 'capitalize',
                }}>
                  {story.type}
                </span>
                <span>Audience: {story.audience}</span>
              </div>
            </div>
          ))}
        </div>

        {selectedStory && (
          <div style={{
            padding: '24px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0 0 16px 0' }}>{selectedStory.title}</h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: '0 0 24px 0' }}>{selectedStory.content}</p>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>Key Points</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {selectedStory.keyPoints.map((point, i) => (
                <li key={i} style={{ fontSize: '14px', color: '#475569', marginBottom: '8px' }}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default DataStoryTeller;
