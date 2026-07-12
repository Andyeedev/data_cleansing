import { useState } from 'react';
import { useDistribution } from './hooks/useDistribution';

type QueueTab = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export const DistributionQueue = () => {
  const { jobs, cancelJob, retryJob, getStatusColor, getChannelLabel } = useDistribution();
  const [activeTab, setActiveTab] = useState<QueueTab>('pending');

  const tabs: Array<{ id: QueueTab; label: string; count: number }> = [
    { id: 'pending', label: 'Pending', count: jobs.filter((j) => j.status === 'pending').length },
    { id: 'running', label: 'Running', count: jobs.filter((j) => j.status === 'running').length },
    { id: 'completed', label: 'Completed', count: jobs.filter((j) => j.status === 'completed').length },
    { id: 'failed', label: 'Failed', count: jobs.filter((j) => j.status === 'failed').length },
    { id: 'cancelled', label: 'Cancelled', count: jobs.filter((j) => j.status === 'cancelled').length },
  ];

  const filteredJobs = jobs.filter((j) => j.status === activeTab);

  return (
    <div>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-primary, #1f2937)', margin: '0 0 1rem 0' }}>Distribution Queue</h2>
      <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--color-border, #e5e7eb)', marginBottom: '1rem' }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '0.5rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: activeTab === tab.id ? 600 : 400, color: activeTab === tab.id ? 'var(--color-primary, #2563eb)' : 'var(--color-text-secondary, #6b7280)', borderBottom: activeTab === tab.id ? '2px solid var(--color-primary, #2563eb)' : '2px solid transparent' }}>
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--color-surface, #ffffff)', borderRadius: '0.5rem', border: '1px solid var(--color-border, #e5e7eb)' }}>
        {filteredJobs.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary, #6b7280)' }}>No {activeTab} deliveries</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary, #6b7280)' }}>Report</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary, #6b7280)' }}>Channel</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary, #6b7280)' }}>Recipient</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary, #6b7280)' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary, #6b7280)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id} style={{ borderBottom: '1px solid var(--color-border, #e5e7eb)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary, #1f2937)' }}>{job.reportName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)' }}>{job.profileName}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-primary, #1f2937)' }}>{getChannelLabel(job.channel)}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-primary, #1f2937)' }}>{job.recipient}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 500, color: '#fff', background: getStatusColor(job.status) }}>{job.status}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {job.status === 'pending' && <button onClick={() => cancelJob(job.id)} style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--color-border, #e5e7eb)', borderRadius: '0.25rem', background: 'var(--color-surface, #ffffff)', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--color-text-secondary, #6b7280)' }}>Cancel</button>}
                    {job.status === 'failed' && <button onClick={() => retryJob(job.id)} style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--color-primary, #2563eb)', borderRadius: '0.25rem', background: 'var(--color-primary, #2563eb)', cursor: 'pointer', fontSize: '0.75rem', color: '#fff' }}>Retry</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
