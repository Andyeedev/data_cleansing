import { useState, useEffect } from 'react';
import { Modal } from '../components/shared/Modal';
import type { SystemDetail, ConnectionConfig } from '../types/systems';

interface SystemFormModalProps {
  open: boolean;
  system?: SystemDetail | null;
  onClose: () => void;
  onSave: (data: SystemFormData) => Promise<void>;
}

export interface SystemFormData {
  system_name: string;
  system_role: 'SOURCE' | 'TARGET';
  database_type: string;
  connection_config: ConnectionConfig;
  credential_username: string;
  credential_password: string;
}

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

function getDefaultPort(dbType: string): number | undefined {
  return DB_TYPES.find((d) => d.value === dbType)?.defaultPort;
}

export function SystemFormModal({ open, system, onClose, onSave }: SystemFormModalProps) {
  const isEdit = !!system;

  const [systemName, setSystemName] = useState('');
  const [systemRole, setSystemRole] = useState<'SOURCE' | 'TARGET'>('SOURCE');
  const [dbType, setDbType] = useState('postgres');
  const [host, setHost] = useState('');
  const [port, setPort] = useState<number | ''>(5432);
  const [database, setDatabase] = useState('');
  const [sslMode, setSslMode] = useState('');
  const [encrypt, setEncrypt] = useState(false);
  const [trustCert, setTrustCert] = useState(false);
  const [credUsername, setCredUsername] = useState('');
  const [credPassword, setCredPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCloudType = ['azure_sql', 'azure_postgres', 'aws_rds_postgres', 'snowflake', 'bigquery'].includes(dbType);
  const needsPort = dbType !== 'bigquery';

  useEffect(() => {
    if (!open) return;
    if (system) {
      setSystemName(system.system_name);
      setSystemRole(system.system_role as 'SOURCE' | 'TARGET');
      setDbType(system.database_type.toLowerCase());
      setHost(system.connection_config?.host || '');
      setPort(system.connection_config?.port ?? '');
      setDatabase(system.connection_config?.database || '');
      setSslMode(system.connection_config?.ssl_mode || '');
      setEncrypt(system.connection_config?.encrypt || false);
      setTrustCert(system.connection_config?.trust_server_certificate || false);
      setCredUsername('');
      setCredPassword('');
    } else {
      setSystemName('');
      setSystemRole('SOURCE');
      setDbType('postgres');
      setHost('');
      setPort(5432);
      setDatabase('');
      setSslMode('');
      setEncrypt(false);
      setTrustCert(false);
      setCredUsername('');
      setCredPassword('');
    }
    setError(null);
  }, [open, system]);

  const handleDbTypeChange = (type: string) => {
    setDbType(type);
    const dp = getDefaultPort(type);
    setPort(dp ?? '');
  };

  const handleSubmit = async () => {
    if (!systemName.trim() || !host.trim() || !database.trim() || !credUsername.trim() || !credPassword.trim()) {
      setError('All fields are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const config: ConnectionConfig = {
        host: host.trim(),
        database: database.trim(),
      };
      if (port !== '' && port !== undefined) config.port = Number(port);
      if (sslMode) config.ssl_mode = sslMode;
      if (isCloudType) {
        config.encrypt = encrypt;
        config.trust_server_certificate = trustCert;
      }

      await onSave({
        system_name: systemName.trim(),
        system_role: systemRole,
        database_type: dbType.toUpperCase(),
        connection_config: config,
        credential_username: credUsername.trim(),
        credential_password: credPassword,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: 'var(--space-sm) var(--space-md)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    background: 'var(--color-background)',
    color: 'var(--color-text)',
    fontSize: 'var(--font-size-sm)',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block',
    fontSize: 'var(--font-size-xs)',
    fontWeight: 500,
    marginBottom: 'var(--space-xs)',
    color: 'var(--color-text-secondary)',
  };

  const fieldGroupStyle = {
    marginBottom: 'var(--space-md)',
  };

  return (
    <Modal
      open={open}
      title={isEdit ? 'Edit System' : 'Create New System'}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              color: 'var(--color-text)',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              background: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.5 : 1,
              fontWeight: 500,
            }}
          >
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </>
      }
    >
      {error && (
        <div style={{ padding: 'var(--space-sm)', marginBottom: 'var(--space-md)', background: 'var(--color-danger-bg)', borderRadius: 'var(--radius)', color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)' }}>
          {error}
        </div>
      )}

      <div style={fieldGroupStyle}>
        <label style={labelStyle}>System Name</label>
        <input style={inputStyle} value={systemName} onChange={(e) => setSystemName(e.target.value)} placeholder="e.g. Production PostgreSQL" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
        <div>
          <label style={labelStyle}>Role</label>
          <select style={inputStyle} value={systemRole} onChange={(e) => setSystemRole(e.target.value as 'SOURCE' | 'TARGET')}>
            <option value="SOURCE">Source</option>
            <option value="TARGET">Target</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Database Type</label>
          <select style={inputStyle} value={dbType} onChange={(e) => handleDbTypeChange(e.target.value)}>
            {DB_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: needsPort ? '2fr 1fr' : '1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
        <div>
          <label style={labelStyle}>Host</label>
          <input style={inputStyle} value={host} onChange={(e) => setHost(e.target.value)} placeholder={isCloudType ? 'your-server.database.windows.net' : 'hostname or IP'} />
        </div>
        {needsPort && (
          <div>
            <label style={labelStyle}>Port</label>
            <input style={inputStyle} type="number" value={port} onChange={(e) => setPort(e.target.value === '' ? '' : Number(e.target.value))} placeholder={String(getDefaultPort(dbType) || '')} />
          </div>
        )}
      </div>

      <div style={fieldGroupStyle}>
        <label style={labelStyle}>Database</label>
        <input style={inputStyle} value={database} onChange={(e) => setDatabase(e.target.value)} placeholder={dbType === 'snowflake' ? 'database/schema' : 'database name'} />
      </div>

      {isCloudType && (
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, marginBottom: 'var(--space-sm)', color: 'var(--color-text)' }}>Cloud Settings</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', cursor: 'pointer' }}>
              <input type="checkbox" checked={encrypt} onChange={(e) => setEncrypt(e.target.checked)} />
              Encrypt connection
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', cursor: 'pointer' }}>
              <input type="checkbox" checked={trustCert} onChange={(e) => setTrustCert(e.target.checked)} />
              Trust server certificate
            </label>
            <div>
              <label style={labelStyle}>SSL Mode</label>
              <select style={inputStyle} value={sslMode} onChange={(e) => setSslMode(e.target.value)}>
                <option value="">Default</option>
                <option value="require">Require</option>
                <option value="verify-ca">Verify CA</option>
                <option value="verify-full">Verify Full</option>
                <option value="disable">Disable</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, marginBottom: 'var(--space-md)', color: 'var(--color-text)' }}>Credentials</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div>
            <label style={labelStyle}>Username</label>
            <input style={inputStyle} value={credUsername} onChange={(e) => setCredUsername(e.target.value)} placeholder="db username" />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input style={inputStyle} type="password" value={credPassword} onChange={(e) => setCredPassword(e.target.value)} placeholder="db password" />
          </div>
        </div>
      </div>
    </Modal>
  );
}
