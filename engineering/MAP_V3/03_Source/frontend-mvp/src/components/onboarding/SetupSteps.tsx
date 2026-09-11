import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { apiPost } from '../../utils/apiClient';
import { useProject } from '../../context/ProjectContext';
import { useSubscription } from '../../hooks/useSubscription';

const DB_TYPES = [
  { value: 'postgres', label: 'PostgreSQL', defaultPort: 5432 },
  { value: 'sqlserver', label: 'SQL Server', defaultPort: 1433 },
  { value: 'mysql', label: 'MySQL', defaultPort: 3306 },
  { value: 'oracle', label: 'Oracle', defaultPort: 1521 },
  { value: 'azure_sql', label: 'Azure SQL', defaultPort: 1433 },
  { value: 'azure_postgres', label: 'Azure PostgreSQL', defaultPort: 5432 },
  { value: 'aws_rds_postgres', label: 'AWS RDS PostgreSQL', defaultPort: 5432 },
  { value: 'snowflake', label: 'Snowflake', defaultPort: 443 },
  { value: 'bigquery', label: 'BigQuery', defaultPort: undefined },
];

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
const labelCls = 'block text-xs font-medium text-gray-500 mb-1';
const errorCls = 'text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 mb-4';

interface StepProps {
  onNext: () => void;
}

function LimitWarning({ kind, label }: { kind: 'projects' | 'connections'; label: string }) {
  const { subscription, isAtLimit, isNearLimit, usagePercent } = useSubscription();

  if (!subscription || subscription.status === 'none') return null;

  const atLimit = isAtLimit(kind);
  const nearLimit = isNearLimit(kind);
  const pct = usagePercent(kind);
  const limit = subscription.limits[kind];

  if (!atLimit && !nearLimit) return null;

  return (
    <div className={`rounded-md p-3 mb-4 border ${
      atLimit
        ? 'bg-red-50 border-red-200 text-red-800'
        : 'bg-amber-50 border-amber-200 text-amber-800'
    }`}>
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">
            {atLimit
              ? `${label} limit reached (${limit.current}/${limit.max})`
              : `${label}: ${limit.current} of ${limit.max} used (${pct}%)`}
          </p>
          {atLimit ? (
            <p className="text-xs mt-1">Upgrade your plan to add more {label.toLowerCase()}.</p>
          ) : (
            <p className="text-xs mt-1">This will be your last {label.toLowerCase().slice(0, -1)} on this plan.</p>
          )}
        </div>
      </div>
      {/* Progress bar */}
      <div className="mt-2 h-1.5 bg-white/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${atLimit ? 'bg-red-500' : 'bg-amber-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function CreateProjectStep({ onNext }: StepProps) {
  const { setActiveProject, setAvailableProjects, availableProjects } = useProject();
  const { isAtLimit } = useSubscription();
  const [name, setName] = useState('');
  const [projectType, setProjectType] = useState('MIGRATION');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const atLimit = isAtLimit('projects');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await apiPost<{ project_id: string; project_name: string; status: string }>(
        '/migration/projects',
        { project_name: name.trim(), project_type: projectType }
      );
      const newProject = { project_id: res.project_id, project_name: res.project_name, status: res.status };
      setActiveProject(newProject);
      setAvailableProjects([...availableProjects, newProject]);
      onNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Create Your Project</h2>
      <p className="text-sm text-gray-500 mb-6">Projects organize your migration work. Give it a name to get started.</p>

      <LimitWarning kind="projects" label="Projects" />

      {error && <div className={errorCls}>{error}</div>}

      <div className="max-w-md space-y-4">
        <div>
          <label className={labelCls}>Project Name</label>
          <input
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Production Migration"
            autoFocus
          />
        </div>
        <div>
          <label className={labelCls}>Project Type</label>
          <select className={inputCls} value={projectType} onChange={(e) => setProjectType(e.target.value)}>
            <option value="MIGRATION">Migration</option>
            <option value="DATA_QUALITY">Data Quality</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={saving || !name.trim() || atLimit}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Creating...' : atLimit ? 'Limit Reached' : 'Create & Next →'}
        </button>
      </div>
    </div>
  );
}

export function ConnectSourceStep({ onNext }: StepProps) {
  const { activeProject } = useProject();
  const { isAtLimit } = useSubscription();
  const [systemName, setSystemName] = useState('');
  const [dbType, setDbType] = useState('postgres');
  const [host, setHost] = useState('');
  const [port, setPort] = useState<number | ''>(5432);
  const [database, setDatabase] = useState('');
  const [credUser, setCredUser] = useState('');
  const [credPass, setCredPass] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsPort = dbType !== 'bigquery';
  const atLimit = isAtLimit('connections');

  const handleDbTypeChange = (type: string) => {
    setDbType(type);
    const dt = DB_TYPES.find((d) => d.value === type);
    setPort(dt?.defaultPort ?? '');
  };

  const handleSubmit = async () => {
    if (!systemName.trim() || !host.trim() || !database.trim()) {
      setError('System name, host, and database are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const config: Record<string, unknown> = { host: host.trim(), database: database.trim() };
      if (port !== '' && port !== undefined) config.port = Number(port);

      await apiPost('/systems', {
        project_id: activeProject?.project_id,
        system_name: systemName.trim(),
        system_role: 'SOURCE',
        database_type: dbType.toUpperCase(),
        connection_config: config,
      });

      if (credUser.trim() && credPass) {
        try {
          await apiPost('/credentials', {
            system_name: systemName.trim(),
            username: credUser.trim(),
            password: credPass,
          });
        } catch { /* credential save is best-effort */ }
      }

      onNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect source system');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Connect Source System</h2>
      <p className="text-sm text-gray-500 mb-6">Configure the database you want to migrate data from.</p>

      <LimitWarning kind="connections" label="Systems" />

      {error && <div className={errorCls}>{error}</div>}

      <div className="max-w-lg space-y-4">
        <div>
          <label className={labelCls}>System Name</label>
          <input className={inputCls} value={systemName} onChange={(e) => setSystemName(e.target.value)} placeholder="e.g. Production PostgreSQL" autoFocus />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Database Type</label>
            <select className={inputCls} value={dbType} onChange={(e) => handleDbTypeChange(e.target.value)}>
              {DB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Port</label>
            {needsPort ? (
              <input className={inputCls} type="number" value={port} onChange={(e) => setPort(e.target.value === '' ? '' : Number(e.target.value))} />
            ) : (
              <input className={inputCls} value="N/A" disabled />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Host</label>
            <input className={inputCls} value={host} onChange={(e) => setHost(e.target.value)} placeholder="hostname or IP" />
          </div>
          <div>
            <label className={labelCls}>Database</label>
            <input className={inputCls} value={database} onChange={(e) => setDatabase(e.target.value)} placeholder="database name" />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs font-medium text-gray-500 mb-3">Credentials (optional)</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Username</label>
              <input className={inputCls} value={credUser} onChange={(e) => setCredUser(e.target.value)} placeholder="db username" />
            </div>
            <div>
              <label className={labelCls}>Password</label>
              <input className={inputCls} type="password" value={credPass} onChange={(e) => setCredPass(e.target.value)} placeholder="db password" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={saving || !systemName.trim() || !host.trim() || !database.trim() || atLimit}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Connecting...' : atLimit ? 'Limit Reached' : 'Connect & Next →'}
        </button>
      </div>
    </div>
  );
}

export function ConnectTargetStep({ onNext }: StepProps) {
  const { activeProject } = useProject();
  const { isAtLimit } = useSubscription();
  const [systemName, setSystemName] = useState('');
  const [dbType, setDbType] = useState('postgres');
  const [host, setHost] = useState('');
  const [port, setPort] = useState<number | ''>(5432);
  const [database, setDatabase] = useState('');
  const [credUser, setCredUser] = useState('');
  const [credPass, setCredPass] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsPort = dbType !== 'bigquery';
  const atLimit = isAtLimit('connections');

  const handleDbTypeChange = (type: string) => {
    setDbType(type);
    const dt = DB_TYPES.find((d) => d.value === type);
    setPort(dt?.defaultPort ?? '');
  };

  const handleSubmit = async () => {
    if (!systemName.trim() || !host.trim() || !database.trim()) {
      setError('System name, host, and database are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const config: Record<string, unknown> = { host: host.trim(), database: database.trim() };
      if (port !== '' && port !== undefined) config.port = Number(port);

      await apiPost('/systems', {
        project_id: activeProject?.project_id,
        system_name: systemName.trim(),
        system_role: 'TARGET',
        database_type: dbType.toUpperCase(),
        connection_config: config,
      });

      if (credUser.trim() && credPass) {
        try {
          await apiPost('/credentials', {
            system_name: systemName.trim(),
            username: credUser.trim(),
            password: credPass,
          });
        } catch { /* credential save is best-effort */ }
      }

      onNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect target system');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Connect Target System</h2>
      <p className="text-sm text-gray-500 mb-6">Configure the database you want to migrate data to.</p>

      <LimitWarning kind="connections" label="Systems" />

      {error && <div className={errorCls}>{error}</div>}

      <div className="max-w-lg space-y-4">
        <div>
          <label className={labelCls}>System Name</label>
          <input className={inputCls} value={systemName} onChange={(e) => setSystemName(e.target.value)} placeholder="e.g. Target SQL Server" autoFocus />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Database Type</label>
            <select className={inputCls} value={dbType} onChange={(e) => handleDbTypeChange(e.target.value)}>
              {DB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Port</label>
            {needsPort ? (
              <input className={inputCls} type="number" value={port} onChange={(e) => setPort(e.target.value === '' ? '' : Number(e.target.value))} />
            ) : (
              <input className={inputCls} value="N/A" disabled />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Host</label>
            <input className={inputCls} value={host} onChange={(e) => setHost(e.target.value)} placeholder="hostname or IP" />
          </div>
          <div>
            <label className={labelCls}>Database</label>
            <input className={inputCls} value={database} onChange={(e) => setDatabase(e.target.value)} placeholder="database name" />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs font-medium text-gray-500 mb-3">Credentials (optional)</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Username</label>
              <input className={inputCls} value={credUser} onChange={(e) => setCredUser(e.target.value)} placeholder="db username" />
            </div>
            <div>
              <label className={labelCls}>Password</label>
              <input className={inputCls} type="password" value={credPass} onChange={(e) => setCredPass(e.target.value)} placeholder="db password" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={saving || !systemName.trim() || !host.trim() || !database.trim() || atLimit}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Connecting...' : atLimit ? 'Limit Reached' : 'Complete Setup →'}
        </button>
      </div>
    </div>
  );
}
