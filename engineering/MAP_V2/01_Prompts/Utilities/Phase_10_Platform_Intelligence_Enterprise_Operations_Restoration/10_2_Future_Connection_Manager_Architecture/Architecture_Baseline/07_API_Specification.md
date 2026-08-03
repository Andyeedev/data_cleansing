# 07 — API Specification

**Phase:** 10.2 — API Specification  
**Status:** Pending Final Approval  
**Date:** 03 August 2026  
**Author:** OpenCode (AI Assistant)

---

## API Resource Hierarchy

```
/systems
/credentials
/connections
/discovery
/mappings
/validation
/onboarding
```

---

## Systems API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/systems/` | GET | List all systems for tenant |
| `/api/v1/systems/{system_id}` | GET | Get system by ID |
| `/api/v1/systems/` | POST | Create system |
| `/api/v1/systems/{system_id}` | PUT | Update system |
| `/api/v1/systems/{system_id}` | DELETE | Delete system |
| `/api/v1/systems/test-connection` | POST | Test system connection |

---

## Credentials API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/credentials/{credential_id}` | GET | Get credential by ID |
| `/api/v1/credentials/by-system/{system_id}` | GET | Get credentials for system |
| `/api/v1/credentials/` | POST | Create credential |
| `/api/v1/credentials/{credential_id}` | PUT | Update credential |
| `/api/v1/credentials/{credential_id}` | DELETE | Delete credential |

---

## Discovery API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/discovery/{project_id}` | GET | Get discovery results |
| `/api/v1/discovery/{project_id}/start` | POST | Start discovery |
| `/api/v1/discovery/{project_id}/status` | GET | Get discovery status |
| `/api/v1/discovery/{project_id}/tables` | GET | Get discovered tables |
| `/api/v1/discovery/{project_id}/columns/{table}` | GET | Get discovered columns |
| `/api/v1/discovery/{project_id}/matches` | GET | Get table matches |

---

## Mappings API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/mappings/{project_id}` | GET | Get all mappings for project |
| `/api/v1/mappings/{project_id}/auto` | POST | Auto-generate mappings |
| `/api/v1/mappings/{mapping_id}` | GET | Get dataset mapping detail |
| `/api/v1/mappings/{mapping_id}` | PUT | Update dataset mapping |
| `/api/v1/mappings/{mapping_id}/columns` | GET | Get column mappings |
| `/api/v1/mappings/{mapping_id}/columns` | POST | Create column mapping |
| `/api/v1/mappings/{mapping_id}/columns/{id}` | PUT | Update column mapping |
| `/api/v1/mappings/{mapping_id}/columns/{id}` | DELETE | Delete column mapping |
| `/api/v1/mappings/{mapping_id}/validate` | POST | Validate mapping |

---

## Validation API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/validation/{project_id}` | GET | Get validation results |
| `/api/v1/validation/{project_id}/run` | POST | Run all validations |
| `/api/v1/validation/{project_id}/connections` | POST | Validate connections |
| `/api/v1/validation/{project_id}/schema` | POST | Validate schema |
| `/api/v1/validation/{project_id}/data` | POST | Validate data |
| `/api/v1/validation/{project_id}/governance` | POST | Validate governance |

---

## Onboarding API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/onboarding/{project_id}/status` | GET | Get onboarding status |
| `/api/v1/onboarding/{project_id}/start` | POST | Start automated onboarding |
| `/api/v1/onboarding/{project_id}/validate` | POST | Validate connections |
| `/api/v1/onboarding/{project_id}/discover` | POST | Trigger discovery |
| `/api/v1/onboarding/{project_id}/map` | POST | Trigger auto-mapping |
| `/api/v1/onboarding/{project_id}/validate-rules` | POST | Auto-configure rules |
| `/api/v1/onboarding/{project_id}/complete` | POST | Complete onboarding |

---

## Frontend Components

### ConnectionTestPanel

A single reusable component embedded in Create System, Edit System, Credential Modal, and Onboarding Wizard — eliminates duplicated connection testing UI.

```tsx
// ConnectionTestPanel.tsx
interface ConnectionTestPanelProps {
  systemId?: string;
  connectionConfig: Record<string, any>;
  dbType: string;
  onTestComplete?: (result: ConnectionTestResult) => void;
  showHistory?: boolean;
}

export function ConnectionTestPanel({
  systemId,
  connectionConfig,
  dbType,
  onTestComplete,
  showHistory = false
}: ConnectionTestPanelProps) {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<ConnectionTestResult | null>(null);
  const [history, setHistory] = useState<ConnectionEvent[]>([]);

  const handleTest = async () => {
    setTesting(true);
    try {
      const res = await apiPost('/api/v1/systems/test-connection', {
        system_id: systemId,
        db_type: dbType,
        config: connectionConfig,
      });
      setResult(res);
      onTestComplete?.(res);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">Connection Test</h4>
        <Button onClick={handleTest} disabled={testing}>
          {testing ? 'Testing...' : 'Test Connection'}
        </Button>
      </div>

      {result && (
        <div className={result.success ? 'bg-green-50' : 'bg-red-50'}>
          <p>{result.message}</p>
          <p className="text-sm text-gray-500">Latency: {result.latency_ms}ms</p>
          {result.server_version && <p>Version: {result.server_version}</p>}
        </div>
      )}

      {showHistory && history.length > 0 && (
        <ConnectionEventLog events={history} />
      )}
    </div>
  );
}
```

**Embedding locations:**
- `CreateSystemPage` — test before save
- `EditSystemPage` — re-test after config change
- `CredentialModal` — test with new credentials
- `OnboardingWizard` — validate all connections in sequence
