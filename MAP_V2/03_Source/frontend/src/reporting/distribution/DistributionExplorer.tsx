import { useState } from 'react';
import { useDistribution } from './hooks/useDistribution';

export const DistributionExplorer = () => {
  const { jobs, profiles, templates, getChannelLabel, getStatusColor } = useDistribution();
  const [view, setView] = useState<'jobs' | 'profiles' | 'templates'>('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const handleSearch = () => {
    setActiveSearch(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setActiveSearch(searchTerm);
    }
  };

  const filteredJobs = jobs.filter((j) => j.reportName.toLowerCase().includes(activeSearch.toLowerCase()));
  const filteredProfiles = profiles.filter((p) => p.name.toLowerCase().includes(activeSearch.toLowerCase()));
  const filteredTemplates = templates.filter((t) => t.name.toLowerCase().includes(activeSearch.toLowerCase()));

  return (
    <div>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Distribution Explorer</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search reports, profiles, templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid var(--color-border, #e5e7eb)', borderRadius: '0.25rem', fontSize: '0.875rem' }}
        />
        <button
          onClick={handleSearch}
          style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-primary, #2563eb)', borderRadius: '0.25rem', background: 'var(--color-primary, #2563eb)', color: '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
        >
          Search
        </button>
        {activeSearch && (
          <button
            onClick={() => { setSearchTerm(''); setActiveSearch(''); }}
            style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-border, #e5e7eb)', borderRadius: '0.25rem', background: 'var(--color-surface, #ffffff)', color: 'var(--color-text-secondary, #6b7280)', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Clear
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
        {(['jobs', 'profiles', 'templates'] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-border, #e5e7eb)', borderRadius: '0.25rem', background: view === v ? 'var(--color-primary, #2563eb)' : 'var(--color-surface, #ffffff)', color: view === v ? '#fff' : 'var(--color-text-primary, #1f2937)', cursor: 'pointer', fontSize: '0.875rem' }}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>
        ))}
      </div>

      {activeSearch && (
        <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary, #6b7280)' }}>
          Showing results for "<strong>{activeSearch}</strong>" in {view}
        </div>
      )}

      <div style={{ background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
        {view === 'jobs' && filteredJobs.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary, #6b7280)' }}>No jobs found</div>
        )}
        {view === 'jobs' && filteredJobs.map((job) => (
          <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary, #1f2937)' }}>{job.reportName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)' }}>{getChannelLabel(job.channel)} • {job.recipient}</div>
            </div>
            <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 500, color: '#fff', background: getStatusColor(job.status) }}>{job.status}</span>
          </div>
        ))}
        {view === 'profiles' && filteredProfiles.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary, #6b7280)' }}>No profiles found</div>
        )}
        {view === 'profiles' && filteredProfiles.map((profile) => (
          <div key={profile.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary, #1f2937)' }}>{profile.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)' }}>{profile.description}</div>
            </div>
            <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 500, color: '#fff', background: profile.enabled ? '#10b981' : '#6b7280' }}>{profile.enabled ? 'Active' : 'Inactive'}</span>
          </div>
        ))}
        {view === 'templates' && filteredTemplates.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary, #6b7280)' }}>No templates found</div>
        )}
        {view === 'templates' && filteredTemplates.map((template) => (
          <div key={template.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary, #1f2937)' }}>{template.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)' }}>{template.description}</div>
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary, #2563eb)' }}>{template.usageCount} uses</span>
          </div>
        ))}
      </div>
    </div>
  );
};
