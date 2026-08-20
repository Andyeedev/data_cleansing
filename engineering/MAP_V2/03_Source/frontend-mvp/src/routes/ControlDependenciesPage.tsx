import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useControlDependencies } from '../hooks/useControlDependencies';
import { PageHeader } from '../components/PageHeader/PageHeader';
import { MetricCard } from '../components/shared/MetricCard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { Modal } from '../components/shared/Modal';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import CascadeDropdowns from '../components/shared/CascadeDropdowns';
import { useValidationFilter } from '../context/ValidationFilterContext';

export function ControlDependenciesPage() {
  const { userRoles } = useAuth();
  const { projectId } = useValidationFilter();
  const { data, loading, error, refetch, addDependency, deleteDependency } = useControlDependencies(projectId);
  const [selectedChainIdx, setSelectedChainIdx] = useState<number | null>(null);
  const [selectedStandaloneId, setSelectedStandaloneId] = useState<string | null>(null);
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);
  const [expandedChains, setExpandedChains] = useState<Set<number>>(new Set([0, 1]));
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ control: string; dependsOn: string } | null>(null);
  const [newDep, setNewDep] = useState({ control_id: '', depends_on: '' });

  if (!userRoles.includes('admin')) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <PageHeader title="Control Dependencies" description="Manage DAG execution order between controls" />
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <PageHeader title="Control Dependencies" description="Manage DAG execution order between controls" />
        <LoadingSkeleton variant="table" rows={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <PageHeader title="Control Dependencies" description="Manage DAG execution order between controls" />
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  const tree = data?.tree;
  const controlStatus = tree?.control_status || {};
  const totalDeps = data?.total || 0;
  const enabledControls = Object.values(controlStatus).filter(Boolean).length;
  const disabledControls = Object.values(controlStatus).filter((v) => !v).length;

  const handleChainClick = (idx: number) => {
    setSelectedChainIdx(idx);
    setSelectedStandaloneId(null);
    setSelectedControlId(null);
  };

  const handleStandaloneClick = (id: string) => {
    setSelectedStandaloneId(id);
    setSelectedChainIdx(null);
    setSelectedControlId(null);
  };

  const handleControlSelect = (controlId: string) => {
    setSelectedControlId(controlId);
  };

  const handleAdd = async () => {
    if (!newDep.control_id || !newDep.depends_on) return;
    const success = await addDependency(newDep.control_id, newDep.depends_on, projectId);
    if (success) {
      setAddModalOpen(false);
      setNewDep({ control_id: '', depends_on: '' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteDependency(deleteTarget.control, deleteTarget.dependsOn, projectId);
    setDeleteTarget(null);
    setSelectedControlId(null);
  };

  const toggleChain = (idx: number) => {
    const next = new Set(expandedChains);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setExpandedChains(next);
  };

  // Resolve selected control info
  const allControlIds = Object.keys(controlStatus);
  const resolvedControlId = selectedControlId || selectedStandaloneId ||
    (selectedChainIdx !== null && tree?.chains?.[selectedChainIdx]?.[0]) || null;

  // Find what this control depends on and what depends on it
  const dependsOn = data?.dependencies?.filter((d) => d.control_id === resolvedControlId) || [];
  const dependedBy = data?.dependencies?.filter((d) => d.depends_on_control_id === resolvedControlId) || [];

  const panelStyle: React.CSSProperties = {
    background: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
  };

  const chainHeaderStyle: React.CSSProperties = {
    padding: 'var(--space-sm) var(--space-md)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 600,
    color: 'var(--color-text)',
    background: 'var(--color-bg-secondary)',
    borderBottom: '1px solid var(--color-border)',
  };

  const chainItemStyle: React.CSSProperties = {
    padding: 'var(--space-xs) var(--space-md) var(--space-xs) var(--space-xl)',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: 'var(--space-sm) var(--space-md)',
    fontWeight: 700,
    fontSize: 'var(--font-size-xs)',
    background: 'var(--color-bg-secondary)',
    borderBottom: '2px solid var(--color-border)',
    color: 'var(--color-text)',
  };

  const tdStyle: React.CSSProperties = {
    padding: 'var(--space-sm) var(--space-md)',
    fontSize: 'var(--font-size-sm)',
    borderBottom: '1px solid var(--color-border)',
    color: 'var(--color-text)',
  };

  return (
    <div style={{ padding: 'var(--space-lg)' }}>
      <PageHeader
        title="Control Dependencies"
        description="Manage DAG execution order between validation controls"
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
            <CascadeDropdowns showTenant={false} showBatch={false} />
            <button
              onClick={() => setAddModalOpen(true)}
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                background: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 600,
              }}
            >
              + Add Dependency
            </button>
          </div>
        }
      />

      {/* Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 'var(--space-md)',
        marginBottom: 'var(--space-lg)',
      }}>
        <MetricCard title="Total Dependencies" value={String(totalDeps)} color="var(--color-primary)" />
        <MetricCard title="Enabled Controls" value={String(enabledControls)} color="var(--color-success)" />
        <MetricCard title="Disabled Controls" value={String(disabledControls)} color="var(--color-danger)" />
        <MetricCard title="Dependency Chains" value={String(tree?.chains?.length || 0)} color="var(--color-warning)" />
      </div>

      {/* Split View */}
      <div style={{ display: 'flex', gap: 'var(--space-md)', minHeight: '500px' }}>

        {/* Left Panel: Tree */}
        <div style={{ ...panelStyle, width: '35%', minWidth: '280px', flexShrink: 0 }}>
          <div style={{
            padding: 'var(--space-sm) var(--space-md)',
            fontWeight: 700,
            fontSize: 'var(--font-size-sm)',
            borderBottom: '2px solid var(--color-border)',
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text)',
          }}>
            Dependency Chains
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {/* Chains */}
            {tree?.chains?.map((chain, idx) => (
              <div key={idx}>
                <div
                  style={{
                    ...chainHeaderStyle,
                    background: selectedChainIdx === idx ? 'var(--color-primary-bg)' : 'var(--color-bg-secondary)',
                  }}
                  onClick={() => {
                    handleChainClick(idx);
                    toggleChain(idx);
                  }}
                >
                  <span style={{ fontSize: '10px', transform: expandedChains.has(idx) ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>
                    ▶
                  </span>
                  Chain {idx + 1}
                  <StatusBadge status={`${chain.length} controls`} size="sm" />
                </div>
                {expandedChains.has(idx) && chain.map((cid, i) => (
                  <div
                    key={cid}
                    style={{
                      ...chainItemStyle,
                      background: selectedControlId === cid ? 'var(--color-primary-bg)' : 'transparent',
                      color: controlStatus[cid] === false ? 'var(--color-text-muted)' : 'var(--color-text)',
                      fontWeight: selectedControlId === cid ? 600 : 400,
                    }}
                    onClick={() => handleControlSelect(cid)}
                  >
                    <span style={{ color: controlStatus[cid] === false ? 'var(--color-danger)' : 'var(--color-success)', fontSize: '10px' }}>
                      {controlStatus[cid] === false ? '●' : '●'}
                    </span>
                    {cid}
                    {i < chain.length - 1 && <span style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>→</span>}
                  </div>
                ))}
              </div>
            ))}

            {/* Standalone */}
            {tree?.standalone && tree.standalone.length > 0 && (
              <div>
                <div
                  style={{
                    ...chainHeaderStyle,
                    background: 'var(--color-bg-secondary)',
                  }}
                >
                  <span style={{ fontSize: '10px' }}>○</span>
                  Standalone
                  <StatusBadge status={`${tree.standalone.length} controls`} size="sm" />
                </div>
                {tree.standalone.map((cid) => (
                  <div
                    key={cid}
                    style={{
                      ...chainItemStyle,
                      background: selectedStandaloneId === cid ? 'var(--color-primary-bg)' : 'transparent',
                      color: controlStatus[cid] === false ? 'var(--color-text-muted)' : 'var(--color-text)',
                      fontWeight: selectedStandaloneId === cid ? 600 : 400,
                    }}
                    onClick={() => handleStandaloneClick(cid)}
                  >
                    <span style={{ color: controlStatus[cid] === false ? 'var(--color-danger)' : 'var(--color-success)', fontSize: '10px' }}>
                      {controlStatus[cid] === false ? '●' : '●'}
                    </span>
                    {cid}
                  </div>
                ))}
              </div>
            )}

            {(!tree?.chains || tree.chains.length === 0) && (!tree?.standalone || tree.standalone.length === 0) && (
              <EmptyState title="No controls found" description="No controls registered in the system" />
            )}
          </div>
        </div>

        {/* Right Panel: Details */}
        <div style={{ ...panelStyle, flex: 1 }}>
          <div style={{
            padding: 'var(--space-sm) var(--space-md)',
            fontWeight: 700,
            fontSize: 'var(--font-size-sm)',
            borderBottom: '2px solid var(--color-border)',
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text)',
          }}>
            {resolvedControlId ? `Control: ${resolvedControlId}` : 'Select a control'}
          </div>

          <div style={{ padding: 'var(--space-md)', overflowY: 'auto', flex: 1 }}>
            {!resolvedControlId ? (
              <EmptyState
                title="No control selected"
                description="Click a control in the left panel to view its dependencies"
              />
            ) : (
              <div>
                {/* Control Info */}
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 700, marginBottom: 'var(--space-sm)', color: 'var(--color-text)' }}>
                    {resolvedControlId}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Status:</span>
                    <StatusBadge
                      status={controlStatus[resolvedControlId] !== false ? 'enabled' : 'disabled'}
                      size="sm"
                    />
                  </div>
                </div>

                {/* Depends On */}
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, marginBottom: 'var(--space-sm)', color: 'var(--color-text)' }}>
                    Depends On
                  </div>
                  {dependsOn.length === 0 ? (
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', padding: 'var(--space-sm)' }}>
                      No dependencies (root control)
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={thStyle}>Control</th>
                          <th style={thStyle}>Status</th>
                          <th style={thStyle}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dependsOn.map((dep) => (
                          <tr key={dep.depends_on_control_id}>
                            <td style={tdStyle}>{dep.depends_on_control_id}</td>
                            <td style={tdStyle}>
                              <StatusBadge
                                status={controlStatus[dep.depends_on_control_id] !== false ? 'enabled' : 'disabled'}
                                size="sm"
                              />
                            </td>
                            <td style={tdStyle}>
                              <button
                                onClick={() => setDeleteTarget({ control: dep.control_id, dependsOn: dep.depends_on_control_id })}
                                style={{
                                  padding: '2px 8px',
                                  background: 'var(--color-danger)',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 'var(--radius-sm)',
                                  cursor: 'pointer',
                                  fontSize: 'var(--font-size-xs)',
                                }}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Depended By */}
                <div>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, marginBottom: 'var(--space-sm)', color: 'var(--color-text)' }}>
                    Depended By
                  </div>
                  {dependedBy.length === 0 ? (
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', padding: 'var(--space-sm)' }}>
                      No controls depend on this
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={thStyle}>Control</th>
                          <th style={thStyle}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dependedBy.map((dep) => (
                          <tr key={dep.control_id}>
                            <td style={tdStyle}>{dep.control_id}</td>
                            <td style={tdStyle}>
                              <StatusBadge
                                status={controlStatus[dep.control_id] !== false ? 'enabled' : 'disabled'}
                                size="sm"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Dependency Modal */}
      <Modal
        open={addModalOpen}
        title="Add Dependency"
        onClose={() => {
          setAddModalOpen(false);
          setNewDep({ control_id: '', depends_on: '' });
        }}
        footer={
          <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setAddModalOpen(false);
                setNewDep({ control_id: '', depends_on: '' });
              }}
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newDep.control_id || !newDep.depends_on}
              style={{
                padding: 'var(--space-sm) var(--space-md)',
                background: newDep.control_id && newDep.depends_on ? 'var(--color-primary)' : 'var(--color-bg-muted)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: newDep.control_id && newDep.depends_on ? 'pointer' : 'not-allowed',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 600,
              }}
            >
              Add
            </button>
          </div>
        }
      >
        <div style={{ padding: 'var(--space-md)' }}>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-xs)', color: 'var(--color-text)' }}>
              Control (depends on another)
            </label>
            <select
              value={newDep.control_id}
              onChange={(e) => setNewDep({ ...newDep, control_id: e.target.value })}
              style={{
                width: '100%',
                padding: 'var(--space-sm)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
              }}
            >
              <option value="">Select control...</option>
              {allControlIds.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-xs)', color: 'var(--color-text)' }}>
              Depends On (must run first)
            </label>
            <select
              value={newDep.depends_on}
              onChange={(e) => setNewDep({ ...newDep, depends_on: e.target.value })}
              style={{
                width: '100%',
                padding: 'var(--space-sm)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
              }}
            >
              <option value="">Select dependency...</option>
              {allControlIds.filter((id) => id !== newDep.control_id).map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove Dependency"
        message={`Remove dependency: ${deleteTarget?.control} → ${deleteTarget?.dependsOn}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel="Remove"
        variant="danger"
      />
    </div>
  );
}

export default ControlDependenciesPage;
