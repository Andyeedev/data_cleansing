import { useState } from 'react';
import { apiGet } from '../../utils/apiClient';

interface ConnectionTestPanelProps {
  systemId?: string;
  connectionConfig: Record<string, any>;
  dbType: string;
  onTestComplete?: (result: ConnectionTestResult) => void;
  showHistory?: boolean;
}

interface ConnectionTestResult {
  success: boolean;
  message: string;
  latency_ms?: number;
  server_version?: string;
}

interface ConnectionEvent {
  timestamp: string;
  success: boolean;
  latency_ms: number;
  message: string;
}

export function ConnectionTestPanel({
  systemId,
  connectionConfig,
  dbType,
  onTestComplete,
  showHistory = false,
}: ConnectionTestPanelProps) {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<ConnectionTestResult | null>(null);
  const [history, setHistory] = useState<ConnectionEvent[]>([]);

  const handleTest = async () => {
    if (!systemId) return;
    setTesting(true);
    try {
      const res = await apiGet<ConnectionTestResult>(`/systems/${systemId}/test`);
      setResult(res);
      setHistory((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          success: res.success,
          latency_ms: res.latency_ms ?? 0,
          message: res.message,
        },
      ]);
      onTestComplete?.(res);
    } catch (error) {
      setResult({
        success: false,
        message: String(error),
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ fontWeight: 500, margin: 0 }}>Connection Test</h4>
        <button
          onClick={handleTest}
          disabled={testing || !systemId}
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-inverse)',
            borderRadius: '6px',
            border: 'none',
            cursor: testing ? 'not-allowed' : 'pointer',
            opacity: testing ? 0.5 : 1,
          }}
        >
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      {result && (
        <div
          style={{
            padding: '12px',
            borderRadius: '6px',
            backgroundColor: result.success ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
          }}
        >
          <p style={{ margin: 0 }}>{result.message}</p>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
            Latency: {result.latency_ms ?? 'N/A'}ms
          </p>
          {result.server_version && (
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
              Version: {result.server_version}
            </p>
          )}
        </div>
      )}

      {showHistory && history.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <h5 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Test History</h5>
          <ul style={{ fontSize: '14px', listStyle: 'none', padding: 0, margin: 0 }}>
            {history.map((event, index) => (
              <li
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 0',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <span>{event.message}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>{event.latency_ms}ms</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
