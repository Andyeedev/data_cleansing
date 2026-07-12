import { useState } from 'react';

interface TechnicalReport {
  id: string;
  title: string;
  version: string;
  sections: {
    title: string;
    content: string;
    subsections?: { title: string; content: string }[];
  }[];
  metrics: {
    label: string;
    value: string;
    unit: string;
  }[];
}

const DEMO_TECHNICAL_REPORT: TechnicalReport = {
  id: 'tech-001',
  title: 'Technical Migration Analysis',
  version: 'v2.1',
  sections: [
    {
      title: 'Methodology',
      content: 'The migration employed a phased approach with parallel processing, checkpoint recovery, and comprehensive validation at each stage.',
      subsections: [
        { title: 'Phase 1: Schema Mapping', content: 'Automated schema comparison with manual review for complex data types.' },
        { title: 'Phase 2: Data Extraction', content: 'Parallel extraction using chunked processing for large tables.' },
        { title: 'Phase 3: Validation', content: 'Multi-stage validation including referential integrity and business rules.' },
      ],
    },
    {
      title: 'Technical Findings',
      content: 'Analysis reveals optimal batch sizes of 10,000 rows for most tables, with parallel processing providing 2.5x throughput improvement.',
    },
    {
      title: 'Recommendations',
      content: 'Implement automated checkpoint recovery, optimize index strategies, and consider partitioning for tables exceeding 10M rows.',
    },
  ],
  metrics: [
    { label: 'Total Records', value: '2.4M', unit: 'records' },
    { label: 'Processing Time', value: '1.8', unit: 'hours/batch' },
    { label: 'Error Rate', value: '0.8', unit: '%' },
    { label: 'Throughput', value: '15K', unit: 'records/min' },
  ],
};

export function TechnicalReport() {
  const [report] = useState<TechnicalReport>(DEMO_TECHNICAL_REPORT);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{report.title}</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>{report.version}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        {report.metrics.map(metric => (
          <div key={metric.label} style={{
            padding: '12px',
            background: '#f8fafc',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6' }}>{metric.value}</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>{metric.unit}</div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>{metric.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {report.sections.map((section, i) => (
          <div key={i} style={{
            padding: '20px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>{section.title}</h3>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7', margin: '0 0 16px 0' }}>{section.content}</p>
            {section.subsections && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '16px', borderLeft: '2px solid #e2e8f0' }}>
                {section.subsections.map((sub, j) => (
                  <div key={j}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '0 0 4px 0' }}>{sub.title}</h4>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{sub.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TechnicalReport;
