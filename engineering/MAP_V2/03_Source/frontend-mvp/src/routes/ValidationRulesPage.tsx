import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRules, useRuleMutations } from '../hooks/useRules';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { MetricCard } from '../components/shared/MetricCard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { Modal } from '../components/shared/Modal';
import type { RuleRegistryCreateRequest, RuleRegistryUpdateRequest } from '../types/rules';

export function ValidationRulesPage() {
  const { userRoles } = useAuth();
  const { data, loading, error, refetch } = useRules();
  const { createRule, updateRule, deleteRule, loading: mutationLoading } = useRuleMutations();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<RuleRegistryCreateRequest>({
    rule_id: '',
    control_id: '',
    rule_name: '',
    severity_level: 'MEDIUM',
    enabled_flag: true
  });
  const [editForm, setEditForm] = useState<RuleRegistryUpdateRequest>({});

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <h1 style={{ fontSize: 'var(--font-size-h1)', marginBottom: 'var(--space-md)' }}>Rules Management</h1>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  const handleCreate = async () => {
    const result = await createRule(createForm);
    if (result) {
      setShowCreateModal(false);
      setCreateForm({
        rule_id: '',
        control_id: '',
        rule_name: '',
        severity_level: 'MEDIUM',
        enabled_flag: true
      });
      refetch();
    }
  };

  const handleEdit = async () => {
    if (!selectedRule) return;
    const result = await updateRule(selectedRule, editForm);
    if (result) {
      setShowEditModal(false);
      setSelectedRule(null);
      setEditForm({});
      refetch();
    }
  };

  const handleDelete = async (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      const success = await deleteRule(ruleId);
      if (success) {
        refetch();
      }
    }
  };

  const openEditModal = (rule: any) => {
    setSelectedRule(rule.rule_id);
    setEditForm({
      control_id: rule.control_id,
      rule_name: rule.rule_name,
      sql_template_file: rule.sql_template_file,
      severity_level: rule.severity_level,
      enabled_flag: rule.enabled_flag
    });
    setShowEditModal(true);
  };

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <PageHeader
        title="Rules Management"
        description="Manage validation rules and their configurations"
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              background: 'var(--color-primary)',
              color: 'var(--color-text-on-primary)',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            Create Rule
          </button>
        }
      />

      {error && <ErrorState message={error} onRetry={refetch} />}

      {loading && <LoadingSkeleton rows={4} variant="card" />}

      {!loading && !error && data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <MetricCard title="Total Rules" value={data.total} color="var(--color-text)" />
            <MetricCard title="Enabled" value={data.rules.filter(r => r.enabled_flag).length} color="var(--color-success)" />
            <MetricCard title="Disabled" value={data.rules.filter(r => !r.enabled_flag).length} color="var(--color-warning)" />
          </div>

          {data.rules.length === 0 ? (
            <EmptyState title="No rules" description="No validation rules found." />
          ) : (
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              overflow: 'auto',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                <thead style={{ position: 'sticky', top: 0, background: 'var(--color-bg-secondary)', zIndex: 1 }}>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Rule ID</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Rule Name</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Control ID</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Severity</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'left', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Status</th>
                    <th style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'center', fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rules.map((rule) => (
                    <tr key={rule.rule_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{rule.rule_id}</td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>{rule.rule_name}</td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', fontFamily: 'monospace' }}>{rule.control_id}</td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                        <StatusBadge status={rule.severity_level || 'UNKNOWN'} size="sm" />
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                        <StatusBadge status={rule.enabled_flag ? 'ENABLED' : 'DISABLED'} size="sm" />
                      </td>
                      <td style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-xs)', justifyContent: 'center' }}>
                          <button
                            onClick={() => openEditModal(rule)}
                            style={{
                              padding: '4px 12px',
                              fontSize: 'var(--font-size-xs)',
                              border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius)',
                              background: 'var(--color-surface)',
                              cursor: 'pointer',
                              color: 'var(--color-text)',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(rule.rule_id)}
                            style={{
                              padding: '4px 12px',
                              fontSize: 'var(--font-size-xs)',
                              border: '1px solid var(--color-danger)',
                              borderRadius: 'var(--radius)',
                              background: 'var(--color-surface)',
                              cursor: 'pointer',
                              color: 'var(--color-danger)',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Rule"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Rule ID</label>
            <input
              type="text"
              value={createForm.rule_id}
              onChange={(e) => setCreateForm({ ...createForm, rule_id: e.target.value })}
              style={{ width: '100%', padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-sm)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Rule Name</label>
            <input
              type="text"
              value={createForm.rule_name}
              onChange={(e) => setCreateForm({ ...createForm, rule_name: e.target.value })}
              style={{ width: '100%', padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-sm)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Control ID</label>
            <input
              type="text"
              value={createForm.control_id}
              onChange={(e) => setCreateForm({ ...createForm, control_id: e.target.value })}
              style={{ width: '100%', padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-sm)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Severity Level</label>
            <select
              value={createForm.severity_level}
              onChange={(e) => setCreateForm({ ...createForm, severity_level: e.target.value })}
              style={{ width: '100%', padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-sm)' }}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <input
              type="checkbox"
              checked={createForm.enabled_flag}
              onChange={(e) => setCreateForm({ ...createForm, enabled_flag: e.target.checked })}
            />
            <label style={{ fontSize: 'var(--font-size-sm)' }}>Enabled</label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
            <button
              onClick={() => setShowCreateModal(false)}
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={mutationLoading}
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                background: 'var(--color-primary)',
                color: 'var(--color-text-on-primary)',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              {mutationLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Rule"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Rule Name</label>
            <input
              type="text"
              value={editForm.rule_name || ''}
              onChange={(e) => setEditForm({ ...editForm, rule_name: e.target.value })}
              style={{ width: '100%', padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-sm)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Control ID</label>
            <input
              type="text"
              value={editForm.control_id || ''}
              onChange={(e) => setEditForm({ ...editForm, control_id: e.target.value })}
              style={{ width: '100%', padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-sm)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Severity Level</label>
            <select
              value={editForm.severity_level || 'MEDIUM'}
              onChange={(e) => setEditForm({ ...editForm, severity_level: e.target.value })}
              style={{ width: '100%', padding: 'var(--space-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 'var(--font-size-sm)' }}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <input
              type="checkbox"
              checked={editForm.enabled_flag ?? true}
              onChange={(e) => setEditForm({ ...editForm, enabled_flag: e.target.checked })}
            />
            <label style={{ fontSize: 'var(--font-size-sm)' }}>Enabled</label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
            <button
              onClick={() => setShowEditModal(false)}
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              disabled={mutationLoading}
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                background: 'var(--color-primary)',
                color: 'var(--color-text-on-primary)',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              {mutationLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
