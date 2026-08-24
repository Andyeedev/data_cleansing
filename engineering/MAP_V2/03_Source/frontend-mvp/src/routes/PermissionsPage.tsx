import { useEffect, useState, useCallback } from 'react';
import { apiGet, apiPut, apiPost } from '../utils/apiClient';
import { useAuth } from '../context/AuthContext';

const PACK_LABELS: Record<string, string> = {
  operational: 'Operational Pack',
  executive: 'Executive Pack',
  validation_pack: 'Validation Pack',
  governance_pack: 'Governance Pack',
  audit_pack: 'Audit Pack',
};

const PACK_ORDER = ['operational', 'executive', 'validation_pack', 'governance_pack', 'audit_pack'];

export function PermissionsPage() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('admin');

  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [filterRole, setFilterRole] = useState('');
  const [filterPack, setFilterPack] = useState('');
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([
      apiGet<Record<string, Record<string, boolean>>>('/permissions'),
      apiGet<string[]>('/permissions/roles'),
    ])
      .then(([permData, rolesData]) => {
        setMatrix(permData);
        setRoles(rolesData);
        setError(null);
      })
      .catch(() => setError('Failed to load permissions'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const togglePermission = (role: string, pack: string) => {
    if (!isAdmin) return;
    setMatrix(prev => ({
      ...prev,
      [role]: { ...prev[role], [pack]: !(prev[role]?.[pack] ?? false) },
    }));
    setHasChanges(true);
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const permissions = [];
      for (const role of roles) {
        for (const pack of PACK_ORDER) {
          permissions.push({ role_name: role, pack_key: pack, enabled: matrix[role]?.[pack] ?? false });
        }
      }
      await apiPut('/permissions', { permissions });
      setHasChanges(false);
      setLastSaved(new Date().toLocaleTimeString());
    } catch {
      setError('Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  const resetDefaults = async () => {
    if (!confirm('Reset all permissions to defaults?')) return;
    setSaving(true);
    try {
      await apiPost('/permissions/reset', {});
      await loadData();
      setHasChanges(false);
      setLastSaved(new Date().toLocaleTimeString());
    } catch {
      setError('Failed to reset permissions');
    } finally {
      setSaving(false);
    }
  };

  const filteredRoles = filterRole ? roles.filter(r => r === filterRole) : roles;
  const filteredPacks = filterPack ? PACK_ORDER.filter(p => p === filterPack) : PACK_ORDER;

  if (loading) return <div className="p-8 text-center text-gray-500">Loading permissions...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Permissions</h1>
        <p className="text-sm text-gray-500 mt-1">Manage role-based access to report packs</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 mb-4 text-sm text-red-700">{error}</div>
      )}

      {hasChanges && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 mb-4 flex items-center justify-between">
          <span className="text-sm text-yellow-800 font-medium">You have unsaved changes</span>
          <div className="flex gap-2">
            <button onClick={() => { loadData(); setHasChanges(false); }} className="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50">Discard</button>
            <button onClick={saveChanges} disabled={saving} className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </div>
      )}

      {lastSaved && !hasChanges && (
        <div className="rounded-lg border border-green-300 bg-green-50 p-3 mb-4 text-sm text-green-700">
          Last saved at {lastSaved}
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Filter Role</label>
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="mt-1 block w-40 rounded border border-gray-300 px-2 py-1.5 text-sm">
            <option value="">All Roles</option>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">Filter Pack</label>
          <select value={filterPack} onChange={e => setFilterPack(e.target.value)} className="mt-1 block w-40 rounded border border-gray-300 px-2 py-1.5 text-sm">
            <option value="">All Packs</option>
            {PACK_ORDER.map(p => <option key={p} value={p}>{PACK_LABELS[p]}</option>)}
          </select>
        </div>
        <div className="ml-auto flex gap-2">
          {isAdmin && (
            <>
              <button onClick={resetDefaults} disabled={saving} className="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50">Reset to Defaults</button>
              <button onClick={saveChanges} disabled={saving || !hasChanges} className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                {filteredPacks.map(p => (
                  <th key={p} className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{PACK_LABELS[p]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map(role => (
                <tr key={role} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900 capitalize">{role}</span>
                  </td>
                  {filteredPacks.map(pack => {
                    const enabled = matrix[role]?.[pack] ?? false;
                    return (
                      <td key={pack} className="px-4 py-3 text-center">
                        <button
                          onClick={() => togglePermission(role, pack)}
                          disabled={!isAdmin}
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border-2 transition-colors ${
                            enabled
                              ? 'bg-green-100 border-green-500 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 border-gray-300 text-gray-400 hover:bg-gray-200'
                          } ${isAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                          title={`${enabled ? 'Revoke' : 'Grant'} ${PACK_LABELS[pack]} access for ${role}`}
                        >
                          {enabled ? '✓' : '—'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!isAdmin && (
        <p className="mt-4 text-sm text-gray-500">Only administrators can modify permissions.</p>
      )}
    </div>
  );
}

export default PermissionsPage;
