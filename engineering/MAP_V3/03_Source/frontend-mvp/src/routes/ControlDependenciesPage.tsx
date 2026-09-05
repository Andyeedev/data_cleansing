import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useControlDependencies } from '../hooks/useControlDependencies';
import { KpiBox, StatusPill, EmptyState } from '../components/reports/reportWidgets';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ErrorState } from '../components/shared/ErrorState';
import { LoadingSkeleton } from '../components/shared/LoadingSkeleton';
import { Modal } from '../components/shared/Modal';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
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
      <div>
        <ErrorState message="You do not have permission to view this page. Required role: admin" />
      </div>
    );
  }

  if (loading) {
    return <LoadingSkeleton variant="table" rows={6} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
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

  return (
    <div className="space-y-6">
      {/* ========== TOOLBAR ========== */}
      <div className="flex gap-4 items-center">
        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded cursor-pointer font-semibold"
        >
          + Add Dependency
        </button>
      </div>

      {/* ========== KPI ROW ========== */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4 mb-6">
        <KpiBox label="Total Dependencies" value={String(totalDeps)} tone="info" />
        <KpiBox label="Enabled Controls" value={String(enabledControls)} tone="success" />
        <KpiBox label="Disabled Controls" value={String(disabledControls)} tone="error" />
        <KpiBox label="Dependency Chains" value={String(tree?.chains?.length || 0)} tone="warning" />
      </div>

      {/* ========== SPLIT VIEW ========== */}
      <div className="flex gap-4 min-h-[500px]">

        {/* Left Panel: Tree */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden w-[35%] min-w-[280px] shrink-0">
          <div className="px-4 py-2 font-bold text-sm border-b-2 border-gray-200 bg-gray-50 text-gray-700">
            Dependency Chains
          </div>

          <div className="overflow-y-auto flex-1">
            {/* Chains */}
            {tree?.chains?.map((chain, idx) => (
              <div key={idx}>
                <div
                  className={`px-4 py-2 cursor-pointer flex items-center gap-2 text-sm font-semibold text-gray-700 border-b border-gray-200 ${
                    selectedChainIdx === idx ? 'bg-blue-50' : 'bg-gray-50'
                  }`}
                  onClick={() => {
                    handleChainClick(idx);
                    toggleChain(idx);
                  }}
                >
                  <span className="text-[10px]" style={{ transform: expandedChains.has(idx) ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>
                    &#9654;
                  </span>
                  Chain {idx + 1}
                  <StatusPill status={`${chain.length} controls`} />
                </div>
                {expandedChains.has(idx) && chain.map((cid, i) => (
                  <div
                    key={cid}
                    className={`px-4 py-1 pl-10 text-sm cursor-pointer flex items-center gap-2 ${
                      selectedControlId === cid ? 'bg-blue-50 font-semibold' : 'bg-transparent'
                    } ${controlStatus[cid] === false ? 'text-gray-400' : 'text-gray-700'}`}
                    onClick={() => handleControlSelect(cid)}
                  >
                    <span className={`text-[10px] ${controlStatus[cid] === false ? 'text-red-500' : 'text-green-500'}`}>
                      &#9679;
                    </span>
                    {cid}
                    {i < chain.length - 1 && <span className="text-gray-400 text-[10px]">&#8594;</span>}
                  </div>
                ))}
              </div>
            ))}

            {/* Standalone */}
            {tree?.standalone && tree.standalone.length > 0 && (
              <div>
                <div className="px-4 py-2 cursor-pointer flex items-center gap-2 text-sm font-semibold text-gray-700 border-b border-gray-200 bg-gray-50">
                  <span className="text-[10px]">&#9675;</span>
                  Standalone
                  <StatusPill status={`${tree.standalone.length} controls`} />
                </div>
                {tree.standalone.map((cid) => (
                  <div
                    key={cid}
                    className={`px-4 py-1 pl-10 text-sm cursor-pointer flex items-center gap-2 ${
                      selectedStandaloneId === cid ? 'bg-blue-50 font-semibold' : 'bg-transparent'
                    } ${controlStatus[cid] === false ? 'text-gray-400' : 'text-gray-700'}`}
                    onClick={() => handleStandaloneClick(cid)}
                  >
                    <span className={`text-[10px] ${controlStatus[cid] === false ? 'text-red-500' : 'text-green-500'}`}>
                      &#9679;
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
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex-1">
          <div className="px-4 py-2 font-bold text-sm border-b-2 border-gray-200 bg-gray-50 text-gray-700">
            {resolvedControlId ? `Control: ${resolvedControlId}` : 'Select a control'}
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            {!resolvedControlId ? (
              <EmptyState
                title="No control selected"
                description="Click a control in the left panel to view its dependencies"
              />
            ) : (
              <div>
                {/* Control Info */}
                <div className="mb-6">
                  <div className="text-lg font-bold text-gray-700 mb-2">{resolvedControlId}</div>
                  <div className="flex gap-4 items-center">
                    <span className="text-sm text-gray-500">Status:</span>
                    <StatusBadge
                      status={controlStatus[resolvedControlId] !== false ? 'enabled' : 'disabled'}
                      size="sm"
                    />
                  </div>
                </div>

                {/* Depends On */}
                <div className="mb-6">
                  <div className="text-sm font-bold text-gray-700 mb-2">Depends On</div>
                  {dependsOn.length === 0 ? (
                    <div className="text-sm text-gray-400 p-2">
                      No dependencies (root control)
                    </div>
                  ) : (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left px-4 py-2 font-bold text-xs bg-gray-50 border-b-2 border-gray-200 text-gray-700">Control</th>
                          <th className="text-left px-4 py-2 font-bold text-xs bg-gray-50 border-b-2 border-gray-200 text-gray-700">Status</th>
                          <th className="text-left px-4 py-2 font-bold text-xs bg-gray-50 border-b-2 border-gray-200 text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dependsOn.map((dep) => (
                          <tr key={dep.depends_on_control_id}>
                            <td className="px-4 py-2 text-sm border-b border-gray-200 text-gray-700">{dep.depends_on_control_id}</td>
                            <td className="px-4 py-2 text-sm border-b border-gray-200 text-gray-700">
                              <StatusBadge
                                status={controlStatus[dep.depends_on_control_id] !== false ? 'enabled' : 'disabled'}
                                size="sm"
                              />
                            </td>
                            <td className="px-4 py-2 text-sm border-b border-gray-200">
                              <button
                                onClick={() => setDeleteTarget({ control: dep.control_id, dependsOn: dep.depends_on_control_id })}
                                className="px-2 py-0.5 bg-red-600 text-white border-none rounded cursor-pointer text-xs"
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
                  <div className="text-sm font-bold text-gray-700 mb-2">Depended By</div>
                  {dependedBy.length === 0 ? (
                    <div className="text-sm text-gray-400 p-2">
                      No controls depend on this
                    </div>
                  ) : (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left px-4 py-2 font-bold text-xs bg-gray-50 border-b-2 border-gray-200 text-gray-700">Control</th>
                          <th className="text-left px-4 py-2 font-bold text-xs bg-gray-50 border-b-2 border-gray-200 text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dependedBy.map((dep) => (
                          <tr key={dep.control_id}>
                            <td className="px-4 py-2 text-sm border-b border-gray-200 text-gray-700">{dep.control_id}</td>
                            <td className="px-4 py-2 text-sm border-b border-gray-200 text-gray-700">
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

      {/* ========== ADD DEPENDENCY MODAL ========== */}
      <Modal
        open={addModalOpen}
        title="Add Dependency"
        onClose={() => {
          setAddModalOpen(false);
          setNewDep({ control_id: '', depends_on: '' });
        }}
        footer={
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setAddModalOpen(false);
                setNewDep({ control_id: '', depends_on: '' });
              }}
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newDep.control_id || !newDep.depends_on}
              className={`px-4 py-2 text-sm font-semibold rounded border-none cursor-pointer ${
                newDep.control_id && newDep.depends_on
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Add
            </button>
          </div>
        }
      >
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Control (depends on another)
            </label>
            <select
              value={newDep.control_id}
              onChange={(e) => setNewDep({ ...newDep, control_id: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-gray-700"
            >
              <option value="">Select control...</option>
              {allControlIds.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Depends On (must run first)
            </label>
            <select
              value={newDep.depends_on}
              onChange={(e) => setNewDep({ ...newDep, depends_on: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded text-sm bg-white text-gray-700"
            >
              <option value="">Select dependency...</option>
              {allControlIds.filter((id) => id !== newDep.control_id).map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* ========== DELETE CONFIRMATION ========== */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove Dependency"
        message={`Remove dependency: ${deleteTarget?.control} \u2192 ${deleteTarget?.dependsOn}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel="Remove"
        variant="danger"
      />
    </div>
  );
}

export default ControlDependenciesPage;
