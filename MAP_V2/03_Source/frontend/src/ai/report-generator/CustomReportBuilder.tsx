import { useState } from 'react';

interface ReportSection {
  id: string;
  type: 'text' | 'chart' | 'table' | 'metric';
  title: string;
  content: string;
}

interface CustomReport {
  name: string;
  sections: ReportSection[];
}

const AVAILABLE_SECTIONS = [
  { type: 'text', title: 'Text Block', description: 'Add custom text content' },
  { type: 'chart', title: 'Chart', description: 'Add data visualization' },
  { type: 'table', title: 'Data Table', description: 'Add tabular data' },
  { type: 'metric', title: 'KPI Metric', description: 'Add key performance indicator' },
] as const;

export function CustomReportBuilder() {
  const [report, setReport] = useState<CustomReport>({
    name: 'My Custom Report',
    sections: [
      { id: 'sec-1', type: 'text', title: 'Executive Overview', content: 'This report provides a comprehensive overview of migration progress and key findings.' },
      { id: 'sec-2', type: 'metric', title: 'Migration Progress', content: '94% Complete' },
      { id: 'sec-3', type: 'chart', title: 'Progress Chart', content: 'Bar chart showing daily migration volume' },
    ],
  });

  const [draggedSection, setDraggedSection] = useState<string | null>(null);

  const addSection = (type: string) => {
    const newSection: ReportSection = {
      id: `sec-${Date.now()}`,
      type: type as ReportSection['type'],
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      content: 'Enter content here...',
    };
    setReport(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  const removeSection = (id: string) => {
    setReport(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id) }));
  };

  const moveSection = (fromIndex: number, toIndex: number) => {
    const newSections = [...report.sections];
    const [removed] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, removed);
    setReport(prev => ({ ...prev, sections: newSections }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>Custom Report Builder</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px' }}>
        <div style={{
          padding: '16px',
          background: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>Add Section</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {AVAILABLE_SECTIONS.map(section => (
              <button
                key={section.type}
                onClick={() => addSection(section.type)}
                style={{
                  padding: '12px',
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{section.title}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{section.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            value={report.name}
            onChange={(e) => setReport(prev => ({ ...prev, name: e.target.value }))}
            style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
            }}
          />

          {report.sections.map((section, index) => (
            <div
              key={section.id}
              draggable
              onDragStart={() => setDraggedSection(section.id)}
              onDragEnd={() => setDraggedSection(null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedSection) {
                  const fromIndex = report.sections.findIndex(s => s.id === draggedSection);
                  moveSection(fromIndex, index);
                }
              }}
              style={{
                padding: '16px',
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'move',
                opacity: draggedSection === section.id ? 0.5 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#94a3b8', cursor: 'grab' }}>⋮⋮</span>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => {
                      const newSections = report.sections.map(s =>
                        s.id === section.id ? { ...s, title: e.target.value } : s
                      );
                      setReport(prev => ({ ...prev, sections: newSections }));
                    }}
                    style={{
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1e293b',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: '#f8fafc',
                    }}
                  />
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    background: '#e0f2fe',
                    color: '#0369a1',
                    textTransform: 'capitalize',
                  }}>
                    {section.type}
                  </span>
                </div>
                <button
                  onClick={() => removeSection(section.id)}
                  style={{
                    padding: '4px 8px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: '#dc2626',
                    fontSize: '12px',
                  }}
                >
                  Remove
                </button>
              </div>
              <textarea
                value={section.content}
                onChange={(e) => {
                  const newSections = report.sections.map(s =>
                    s.id === section.id ? { ...s, content: e.target.value } : s
                  );
                  setReport(prev => ({ ...prev, sections: newSections }));
                }}
                style={{
                  width: '100%',
                  minHeight: '60px',
                  padding: '8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  fontSize: '13px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          ))}

          {report.sections.length === 0 && (
            <div style={{
              padding: '32px',
              textAlign: 'center',
              color: '#94a3b8',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '2px dashed #e2e8f0',
            }}>
              Drag sections from the left panel or click to add
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomReportBuilder;
