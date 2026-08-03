# 09 — Implementation Roadmap

**Phase:** 10.2 — Implementation Roadmap  
**Status:** Pending Final Approval  
**Date:** 03 August 2026  
**Author:** OpenCode (AI Assistant)

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
- Adapter contract (`ConnectionAdapter` interface)
- Adapter-specific config classes (PostgresConfig, MySQLConfig, etc.)
- `AdapterRegistry` with dynamic registration
- `ConnectionPoolManager` (infrastructure layer)
- `SecretsProvider` / `EncryptionProvider` / `CredentialManager` consolidation
- Fix critical bugs (adapter_factory import, Databricks filename, BigQuery psycopg2)

### Phase 2: Adapters (Week 2)
- Upgrade all adapters to production quality
- Add SSL/TLS support to all adapters
- Add `list_columns()` to all adapters
- Add connection timeout configuration
- Implement structured capability profiles

### Phase 3: Discovery Engine (Week 2-3)
- Discovery service implementation
- Schema introspection via adapters
- Table matching (exact + fuzzy)
- `core.discovery_snapshots` for historical tracking
- Drift detection

### Phase 4: Mapping Engine (Week 3-4)
- Auto-mapping service (depends on Discovery)
- Column-level mapping
- Transformation rule suggestions
- Mapping validation

### Phase 5: CRUD / API / UI (Week 4-5)
- System CRUD endpoints (add PUT/DELETE)
- Credential CRUD endpoints
- Tenant isolation on all queries
- Audit logging (connection + credential events)
- Create/Edit system forms
- Credential modals
- `ConnectionTestPanel` (reusable)
- Onboarding wizard UI

### Phase 6: CLI & Testing (Week 5-6)
- CLI commands for connection management
- CLI commands for discovery/mapping
- `map doctor` platform diagnostics
- Backend unit tests
- Integration tests
- E2E tests

### Phase 7: Documentation (Week 6-7)
- Architecture documentation
- API reference
- Adapter development guide (how to write new adapters)
- Operational runbook
- Deployment guide

---

## Dependency Chain

```
Phase 1: Foundation
    │
    ▼
Phase 2: Adapters
    │
    ▼
Phase 3: Discovery ──▶ Phase 4: Mapping
    │                       │
    ▼                       ▼
Phase 5: CRUD / API / UI
    │
    ▼
Phase 6: CLI & Testing
    │
    ▼
Phase 7: Documentation
```

---

## Deliverables by Phase

| Phase | Deliverables |
|-------|-------------|
| 1 | Adapter contract, config classes, registry, pool manager, security consolidation |
| 2 | 7 production adapters, capability profiles |
| 3 | Discovery service, schema introspection, table matching, snapshots |
| 4 | Mapping service, column mapping, transformation rules |
| 5 | API endpoints, tenant isolation, audit logging, frontend components |
| 6 | CLI commands, `map doctor`, unit/integration/E2E tests |
| 7 | Architecture docs, API reference, adapter guide, runbook, deployment guide |

---

## Architecture Baseline v1.0

**Status:** Pending Final Approval before implementation.

Once approved, this becomes the reference specification that all subsequent implementation work follows. This prevents architectural drift and provides a stable foundation for future phases.
