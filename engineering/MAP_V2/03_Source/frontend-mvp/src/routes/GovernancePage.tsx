import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner';

interface AuditEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_email: string;
  timestamp: string;
  details: Record<string, unknown>;
}

interface Approval {
  id: string;
  entity_type: string;
  entity_id: string;
  status: string;
  requested_by: string;
  created_at: string;
}

interface ComplianceStatus {
  score: number | null;
  total_controls: number;
  passed_controls: number;
  failed_controls: number;
}

interface ExceptionEntry {
  id: string;
  entity_type: string;
  entity_id: string;
  reason: string;
  status: string;
  requested_by: string;
  created_at: string;
}

const TABS = [
  { id: 'overview', label: 'Overview', route: '/governance/overview' },
  { id: 'compliance', label: 'Compliance', route: '/governance/compliance' },
  { id: 'controls', label: 'Controls', route: '/governance/controls' },
  { id: 'exceptions', label: 'Exceptions', route: '/governance/exceptions' },
  { id: 'risk', label: 'Risk', route: '/governance/risk' },
  { id: 'audit', label: 'Audit', route: '/governance/audit' },
  { id: 'approvals', label: 'Approvals', route: '/governance/approvals' },
];

export function GovernancePage() {
  const { userRoles } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [compliance, setCompliance] = useState<ComplianceStatus | null>(null);
  const [exceptions, setExceptions] = useState<ExceptionEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (activeTab === 'audit') {
      setLoading(true);
      fetch('/api/v1/governance/audit?limit=50')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setAuditEntries(data.data.entries || []);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (activeTab === 'approvals') {
      setLoading(true);
      fetch('/api/v1/governance/approvals')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setApprovals(data.data.pending || []);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (activeTab === 'overview' || activeTab === 'compliance') {
      setLoading(true);
      fetch('/api/v1/governance/compliance')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setCompliance(data.data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (activeTab === 'exceptions') {
      setLoading(true);
      fetch('/api/v1/governance/exceptions')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setExceptions(data.data.exceptions || []);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 32 }}>
        <h2 style={{ color: 'var(--color-text-primary)' }}>Access Denied</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  const filteredAudit = auditEntries.filter((entry) => {
    const matchesSearch = searchQuery === '' ||
      entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.entity_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.user_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || entry.entity_type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Governance</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Compliance, risk scoring, release gates, and approval workflows.
          </p>
        </div>
      </div>

      <div role="tablist" style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--color-border)', marginBottom: 24 }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--color-text-secondary)',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 600 : 400,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner />}

      {!loading && activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div style={{ padding: 16, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>Compliance Score</div>
              <div style={{ fontSize: 24, fontWeight: 600 }}>{compliance?.score ?? '—'}</div>
            </div>
            <div style={{ padding: 16, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>Total Controls</div>
              <div style={{ fontSize: 24, fontWeight: 600 }}>{compliance?.total_controls ?? 0}</div>
            </div>
            <div style={{ padding: 16, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>Passed Controls</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: '#22c55e' }}>{compliance?.passed_controls ?? 0}</div>
            </div>
            <div style={{ padding: 16, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>Failed Controls</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: compliance?.failed_controls ? '#ef4444' : 'inherit' }}>{compliance?.failed_controls ?? 0}</div>
            </div>
          </div>
        </div>
      )}

      {!loading && activeTab === 'compliance' && (
        <div style={{ padding: 16, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
          <h3 style={{ marginBottom: 8 }}>Compliance Status</h3>
          {compliance ? (
            <div>
              <p>Score: {compliance.score ?? 'N/A'}</p>
              <p>Total Controls: {compliance.total_controls}</p>
              <p>Passed: {compliance.passed_controls}</p>
              <p>Failed: {compliance.failed_controls}</p>
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-secondary)' }}>No compliance data available.</p>
          )}
        </div>
      )}

      {!loading && activeTab === 'controls' && (
        <div style={{ padding: 16, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
          <h3 style={{ marginBottom: 8 }}>Active Controls</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>No controls configured.</p>
        </div>
      )}

      {!loading && activeTab === 'exceptions' && (
        <div style={{ padding: 16, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
          <h3 style={{ marginBottom: 8 }}>Exception Requests</h3>
          {exceptions.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)' }}>No active exceptions.</p>
          ) : (
            <div>
              {exceptions.map((exc) => (
                <div key={exc.id} style={{ padding: 8, borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontWeight: 600 }}>{exc.entity_type}</span>
                  <span style={{ marginLeft: 8, color: 'var(--color-text-secondary)' }}>{exc.reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'risk' && (
        <div style={{ padding: 16, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
          <h3 style={{ marginBottom: 8 }}>Risk Assessment</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>No risk data available.</p>
        </div>
      )}

      {!loading && activeTab === 'audit' && (
        <div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Search audit logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 4, flex: 1 }}
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 4 }}
            >
              <option value="all">All Types</option>
              <option value="migration_batch">Migration Batch</option>
              <option value="system">System</option>
              <option value="rule">Rule</option>
            </select>
          </div>
          {filteredAudit.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)' }}>No audit entries found.</p>
          ) : (
            <div style={{ background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              {filteredAudit.map((entry) => (
                <div key={entry.id} style={{ padding: 12, borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{entry.action}</span>
                    <span style={{ color: 'var(--color-text-secondary)', marginLeft: 8 }}>{entry.entity_type}</span>
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>
                    {entry.user_email} • {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'approvals' && (
        <div>
          {approvals.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)' }}>No pending approvals.</p>
          ) : (
            <div style={{ background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              {approvals.map((approval) => (
                <div key={approval.id} style={{ padding: 12, borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{approval.entity_type}</span>
                    <span style={{ color: 'var(--color-text-secondary)', marginLeft: 8 }}>{approval.entity_id}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ padding: '4px 8px', background: '#fef3c7', color: '#92400e', borderRadius: 4, fontSize: 12 }}>
                      {approval.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
