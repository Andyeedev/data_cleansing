import { useState } from 'react';
import { useReportCentre } from './hooks/useReportCentre';

export const ReportExplorer = () => {
  const { reports, filters, setFilters } = useReportCentre();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchInput, setSearchInput] = useState(filters.search);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadFormats, setDownloadFormats] = useState<string[]>([]);

  const handleSearch = () => {
    setFilters({ ...filters, search: searchInput });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const openDownloadModal = (reportId: string, formats: string[]) => {
    setSelectedReport(reportId);
    setDownloadFormats(formats);
    setShowDownloadModal(true);
  };

  const closeDownloadModal = () => {
    setSelectedReport(null);
    setDownloadFormats([]);
    setShowDownloadModal(false);
  };

  const handleDownload = (format: string) => {
    const report = reports.find((r) => r.id === selectedReport);
    if (report) {
      alert(`Downloading "${report.name}" in ${format.toUpperCase()} format.\n\nIn a real system, this would trigger the Export Engine to generate and download the file.`);
    }
    closeDownloadModal();
  };

  const categoryColours: Record<string, string> = {
    executive: '#2563eb',
    migration: '#10b981',
    validation: '#3b82f6',
    governance: '#f59e0b',
    risk: '#ef4444',
    security: '#6b7280',
    administration: '#6b7280',
    audit: '#6b7280',
    ai: '#8b5cf6',
  };

  return (
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 0.25rem 0' }}>Report Explorer</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary, #6b7280)', margin: 0 }}>Browse, search and download reports</p>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search reports by name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid var(--color-border, #e5e7eb)', borderRadius: '0.25rem', fontSize: '0.875rem' }}
        />
        <button
          onClick={handleSearch}
          style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-primary, #2563eb)', borderRadius: '0.25rem', background: 'var(--color-primary, #2563eb)', color: '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
        >
          Search
        </button>
        {filters.search && (
          <button
            onClick={() => { setSearchInput(''); setFilters({ ...filters, search: '' }); }}
            style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-border, #e5e7eb)', borderRadius: '0.25rem', background: 'var(--color-surface, #ffffff)', color: 'var(--color-text-secondary, #6b7280)', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Clear
          </button>
        )}
      </div>

      {filters.search && (
        <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary, #6b7280)' }}>
          Showing results for "<strong>{filters.search}</strong>" — {reports.length} report(s) found
        </div>
      )}

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {['all', 'executive', 'migration', 'validation', 'governance', 'risk', 'security', 'administration', 'audit', 'ai'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilters({ ...filters, category: cat as typeof filters.category })}
            style={{ padding: '0.375rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 500, border: '1px solid var(--color-border, #e5e7eb)', cursor: 'pointer', background: filters.category === cat ? 'var(--color-primary, #2563eb)' : 'var(--color-surface, #ffffff)', color: filters.category === cat ? '#fff' : 'var(--color-text-primary, #1f2937)' }}
          >
            {cat === 'all' ? 'All Reports' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setViewMode('grid')}
          style={{ padding: '0.375rem 0.75rem', border: '1px solid var(--color-border, #e5e7eb)', borderRadius: '0.25rem', background: viewMode === 'grid' ? 'var(--color-primary, #2563eb)' : 'var(--color-surface, #ffffff)', color: viewMode === 'grid' ? '#fff' : 'var(--color-text-primary, #1f2937)', cursor: 'pointer', fontSize: '0.75rem' }}
        >
          Grid View
        </button>
        <button
          onClick={() => setViewMode('list')}
          style={{ padding: '0.375rem 0.75rem', border: '1px solid var(--color-border, #e5e7eb)', borderRadius: '0.25rem', background: viewMode === 'list' ? 'var(--color-primary, #2563eb)' : 'var(--color-surface, #ffffff)', color: viewMode === 'list' ? '#fff' : 'var(--color-text-primary, #1f2937)', cursor: 'pointer', fontSize: '0.75rem' }}
        >
          List View
        </button>
      </div>

      {/* Reports Display */}
      {reports.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>&#128269;</div>
          <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-primary, #1f2937)', marginBottom: '0.25rem' }}>No reports found</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary, #6b7280)' }}>Try a different search term or category</div>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {reports.map((report) => (
            <div key={report.id} style={{ background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', marginBottom: '0.25rem' }}>{report.name}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary, #6b7280)' }}>{report.description}</div>
                </div>
                <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.6875rem', fontWeight: 600, background: categoryColours[report.category] || '#6b7280', color: '#fff', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>{report.category}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)' }}>
                <span>{report.owner}</span>
                <span>{report.updatedAt}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary, #6b7280)' }}>Formats:</span>
                {report.format.map((f) => (
                  <span key={f} style={{ padding: '0.125rem 0.375rem', borderRadius: '0.125rem', fontSize: '0.625rem', background: 'var(--color-background, #f3f4f6)', color: 'var(--color-text-primary, #1f2937)', fontWeight: 500, textTransform: 'uppercase' }}>{f}</span>
                ))}
              </div>

              <button
                onClick={() => openDownloadModal(report.id, report.format)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-primary, #2563eb)', borderRadius: '0.25rem', background: 'var(--color-primary, #2563eb)', color: '#fff', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500 }}
              >
                Download Report
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary, #6b7280)' }}>Report Name</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary, #6b7280)' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary, #6b7280)' }}>Owner</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary, #6b7280)' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary, #6b7280)' }}>Formats</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary, #6b7280)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} style={{ borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary, #1f2937)' }}>{report.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)' }}>{report.description}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.6875rem', fontWeight: 600, background: categoryColours[report.category] || '#6b7280', color: '#fff' }}>{report.category}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary, #6b7280)' }}>{report.owner}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.6875rem', fontWeight: 500, background: report.status === 'completed' ? '#d1fae5' : report.status === 'scheduled' ? '#dbeafe' : '#f3f4f6', color: report.status === 'completed' ? '#065f46' : report.status === 'scheduled' ? '#1e40af' : '#374151' }}>{report.status}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {report.format.map((f) => (
                        <span key={f} style={{ padding: '0.125rem 0.375rem', borderRadius: '0.125rem', fontSize: '0.625rem', background: 'var(--color-background, #f3f4f6)', color: 'var(--color-text-primary, #1f2937)', fontWeight: 500, textTransform: 'uppercase' }}>{f}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button
                      onClick={() => openDownloadModal(report.id, report.format)}
                      style={{ padding: '0.375rem 0.75rem', border: '1px solid var(--color-primary, #2563eb)', borderRadius: '0.25rem', background: 'var(--color-primary, #2563eb)', color: '#fff', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500 }}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Download Modal */}
      {showDownloadModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', padding: '1.5rem', width: '400px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: 0 }}>Download Report</h3>
              <button onClick={closeDownloadModal} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--color-text-secondary, #6b7280)' }}>&times;</button>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary, #6b7280)', marginBottom: '1rem' }}>Select a format to download:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              {downloadFormats.map((format) => (
                <button
                  key={format}
                  onClick={() => handleDownload(format)}
                  style={{ padding: '0.75rem', border: '1px solid var(--color-border, #e5e7eb)', borderRadius: '0.25rem', background: 'var(--color-background, #f9fafb)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary, #1f2937)', textTransform: 'uppercase', textAlign: 'center' }}
                >
                  {format}
                </button>
              ))}
            </div>
            <button onClick={closeDownloadModal} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)', borderRadius: '0.25rem', background: 'var(--color-surface, #ffffff)', color: 'var(--color-text-secondary, #6b7280)', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};
