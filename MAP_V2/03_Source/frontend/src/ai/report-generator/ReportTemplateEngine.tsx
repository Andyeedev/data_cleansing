import { useState } from 'react';

interface ReportTemplate {
  id: string;
  name: string;
  type: 'executive' | 'technical' | 'compliance' | 'operational' | 'custom';
  description: string;
  sections: string[];
  lastModified: string;
  version: string;
}

const DEMO_TEMPLATES: ReportTemplate[] = [
  {
    id: 'tpl-001',
    name: 'Executive Summary Template',
    type: 'executive',
    description: 'Standard template for executive-level reports with KPIs and high-level insights.',
    sections: ['Overview', 'Key Metrics', 'Achievements', 'Recommendations'],
    lastModified: '2026-07-10T10:00:00Z',
    version: 'v2.1',
  },
  {
    id: 'tpl-002',
    name: 'Technical Analysis Template',
    type: 'technical',
    description: 'Detailed technical report with methodology, findings, and recommendations.',
    sections: ['Methodology', 'Findings', 'Analysis', 'Recommendations', 'Appendix'],
    lastModified: '2026-07-09T16:00:00Z',
    version: 'v1.3',
  },
  {
    id: 'tpl-003',
    name: 'Compliance Audit Template',
    type: 'compliance',
    description: 'Compliance report template with requirements tracking and audit trail.',
    sections: ['Requirements', 'Status', 'Evidence', 'Audit Trail'],
    lastModified: '2026-07-08T14:00:00Z',
    version: 'v1.5',
  },
  {
    id: 'tpl-004',
    name: 'Operational Metrics Template',
    type: 'operational',
    description: 'Template for daily/weekly operational metrics and KPIs.',
    sections: ['Summary', 'Metrics', 'Trends', 'Actions'],
    lastModified: '2026-07-07T12:00:00Z',
    version: 'v1.2',
  },
];

const TYPE_COLORS: Record<string, string> = {
  executive: '#8b5cf6',
  technical: '#3b82f6',
  compliance: '#10b981',
  operational: '#f59e0b',
  custom: '#64748b',
};

export function ReportTemplateEngine() {
  const [templates] = useState<ReportTemplate[]>(DEMO_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: 0 }}>Report Templates</h2>
        <button
          onClick={() => setIsCreating(true)}
          style={{
            padding: '10px 16px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Create Template
        </button>
      </div>

      {isCreating && (
        <div style={{
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>New Template</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Template name..."
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
            <button
              onClick={() => {
                setIsCreating(false);
                setNewTemplateName('');
              }}
              style={{
                padding: '8px 16px',
                background: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Create
            </button>
            <button
              onClick={() => setIsCreating(false)}
              style={{
                padding: '8px 16px',
                background: '#e2e8f0',
                color: '#64748b',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {templates.map(template => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            style={{
              padding: '16px',
              background: selectedTemplate?.id === template.id ? '#eff6ff' : '#fff',
              border: `1px solid ${selectedTemplate?.id === template.id ? '#3b82f6' : '#e2e8f0'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              borderLeft: `4px solid ${TYPE_COLORS[template.type]}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{template.name}</h3>
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '500',
                color: '#fff',
                background: TYPE_COLORS[template.type],
                textTransform: 'capitalize',
              }}>
                {template.type}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px 0' }}>{template.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
              {template.sections.map((section, i) => (
                <span key={i} style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  background: '#f1f5f9',
                  color: '#64748b',
                }}>
                  {section}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
              <span>{template.version}</span>
              <span>Modified: {new Date(template.lastModified).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div style={{
          padding: '20px',
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 16px 0' }}>Template Preview: {selectedTemplate.name}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {selectedTemplate.sections.map((section, i) => (
              <div key={i} style={{
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '6px',
                borderLeft: `3px solid ${TYPE_COLORS[selectedTemplate.type]}`,
              }}>
                <span style={{ fontSize: '13px', color: '#475569' }}>{section}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportTemplateEngine;
