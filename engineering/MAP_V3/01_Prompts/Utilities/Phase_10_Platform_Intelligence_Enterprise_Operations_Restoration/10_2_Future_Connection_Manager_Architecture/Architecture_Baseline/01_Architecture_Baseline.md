# 01 — Architecture Baseline

**Phase:** 10.2 — Architecture Baseline  
**Status:** Pending Final Approval  
**Date:** 03 August 2026  
**Author:** OpenCode (AI Assistant)

---

## Vision

Design the end-state Connection Manager architecture supporting:

1. Generic connection framework
2. Multiple source/target connection types
3. Automated onboarding
4. Discovery
5. Mapping
6. Validation
7. Metadata-driven architecture
8. Tenant isolation
9. Enterprise security
10. MAP CLI integration

**Constraint:** No assumptions (Azure, Vault, etc.) without approval. Technology choices presented as options.

---

## Design Principles

### Database-Agnostic

The Connection Manager must be **database-agnostic**. The framework treats all connection types uniformly through a common interface, regardless of whether the target is PostgreSQL, Oracle, Snowflake, or any future system.

### Adapter-Specific Configuration

Each adapter defines its own configuration class rather than using a single generic class. This prevents field bloat and enforces adapter-specific validation.

### Structured Capability Profiles

String-based capability lists are replaced by structured `Capability` flags and `AdapterCapabilityProfile` dataclasses, enabling runtime feature detection.

### Metadata-Driven

All pipeline execution is driven by metadata stored in PostgreSQL. No hardcoded logic — connections, discovery, mappings, and validation rules are all resolved from the database.

### Separation of Concerns

- **SecretsProvider** — Credential retrieval
- **EncryptionProvider** — Encryption/decryption operations
- **CredentialManager** — Credential lifecycle CRUD

---

## Metadata Schema

All connection, discovery, mapping, and validation metadata is stored in PostgreSQL:

```
core schema:
├── projects
├── tenants
├── system_registry          -- Connection definitions
├── system_credentials       -- Encrypted credentials
├── system_connection_log    -- Connection test/audit events
├── dataset_mappings         -- Source-to-target table mappings
├── dataset_columns          -- Column metadata
├── column_mappings          -- Source-to-target column mappings
├── onboarding_status        -- Project onboarding progress
├── discovery_results        -- Latest discovery execution results
└── discovery_snapshots      -- Historical discovery snapshots (NEW)

engine schema:
├── migration_validation_batch
├── migration_batch_registry
├── schedule_execution_log
├── migration_control_execution
├── migration_control_summary
└── migration_control_decisions
```

### Discovery Snapshots

Historical snapshots enable schema drift detection, change detection, onboarding comparisons, and audit history.

```sql
CREATE TABLE core.discovery_snapshots (
    snapshot_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id         UUID NOT NULL REFERENCES core.projects(project_id),
    source_system_id   UUID NOT NULL REFERENCES core.system_registry(system_id),
    target_system_id   UUID NOT NULL REFERENCES core.system_registry(system_id),
    snapshot_type      VARCHAR(20) NOT NULL DEFAULT 'FULL',
    -- FULL: complete schema snapshot
    -- INCREMENTAL: only changes since last snapshot
    -- DRIFT: detected drift from previous snapshot

    source_schema      JSONB NOT NULL,
    target_schema      JSONB NOT NULL,
    matched_tables     JSONB NOT NULL,
    matched_columns    JSONB NOT NULL,
    drift_summary      JSONB,
    -- { "added_tables": [...], "removed_tables": [...],
    --   "added_columns": [...], "removed_columns": [...],
    --   "type_changes": [...] }

    snapshot_status    VARCHAR(20) NOT NULL DEFAULT 'COMPLETE',
    -- COMPLETE, PARTIAL, FAILED

    triggered_by       VARCHAR(30) NOT NULL,
    -- onboarding, manual, scheduled, drift_detection

    created_at         TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by         VARCHAR(100)
);

CREATE INDEX idx_discovery_snapshots_project ON core.discovery_snapshots(project_id);
CREATE INDEX idx_discovery_snapshots_systems ON core.discovery_snapshots(source_system_id, target_system_id);
CREATE INDEX idx_discovery_snapshots_created ON core.discovery_snapshots(created_at DESC);
```

**Purpose:**
- **Schema drift:** Compare current discovery against previous snapshot to detect structural changes
- **Change detection:** Track when tables/columns are added, removed, or modified
- **Onboarding comparisons:** Verify onboarding progress by diffing before/after snapshots
- **Audit history:** Complete record of all schema states over time

---

## Metadata-Driven Execution

The entire migration pipeline is driven by metadata:

```
┌─────────────────────────────────────────────────────────────────┐
│                  Metadata-Driven Execution                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐                                               │
│  │   Metadata    │                                               │
│  │   (Postgres)  │                                               │
│  └──────┬───────┘                                               │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │  Connection   │───▶│  Discovery   │───▶│  Mapping     │       │
│  │  Resolver     │    │  Engine      │    │  Engine      │       │
│  └──────────────┘    └──────────────┘    └──────┬───────┘       │
│                                                  │               │
│         ┌────────────────────────────────────────┘               │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │  Validation   │───▶│  Execution   │───▶│  Governance  │       │
│  │  Engine       │    │  Engine      │    │  Engine      │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Metadata Access Pattern

```python
class MetadataDrivenPipeline:
    """Executes migration pipeline driven entirely by metadata."""

    def __init__(self, project_id: str):
        self.project_id = project_id
        self.metadata = MetadataRepository(project_id)

    async def execute(self) -> PipelineResult:
        """Execute the full pipeline based on metadata."""

        # Step 1: Resolve connections from metadata
        connections = await self.metadata.get_connections()

        # Step 2: Get mappings from metadata
        mappings = await self.metadata.get_mappings()

        # Step 3: Get validation rules from metadata
        rules = await self.metadata.get_rules()

        # Step 4: Execute pipeline
        for mapping in mappings:
            source_conn = connections[mapping.source_system_id]
            target_conn = connections[mapping.target_system_id]

            # Execute validation
            validation_result = await self.validate(
                source_conn, target_conn, mapping, rules
            )

            # Store results
            await self.metadata.store_result(mapping, validation_result)

        return PipelineResult(
            project_id=self.project_id,
            status="complete",
            timestamp=datetime.utcnow()
        )
```

---

## Tenant Isolation

### Isolation Model

```
┌─────────────────────────────────────────────────────────────────┐
│                      Tenant Isolation Model                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Tenant A                                                        │
│  ├── Projects                                                    │
│  │   ├── Project A1                                              │
│  │   │   ├── Systems (SOURCE, TARGET)                            │
│  │   │   ├── Credentials (encrypted, tenant-scoped)              │
│  │   │   ├── Mappings                                            │
│  │   │   └── Validation Results                                  │
│  │   └── Project A2                                              │
│  │       └── ...                                                 │
│  └── Users                                                       │
│                                                                   │
│  Tenant B                                                        │
│  ├── Projects                                                    │
│  │   ├── Project B1                                              │
│  │   │   └── ...                                                 │
│  │   └── Project B2                                              │
│  │       └── ...                                                 │
│  └── Users                                                       │
│                                                                   │
│  Isolation: Tenant A cannot see Tenant B's data                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Isolation Implementation

```python
class TenantScopedRepository:
    """Base repository with tenant isolation."""

    def __init__(self, tenant_id: str):
        self.tenant_id = tenant_id

    def get_tenant_filter(self) -> str:
        """Return SQL WHERE clause for tenant isolation."""
        return "tenant_id = %s"

    def get_tenant_params(self) -> tuple:
        """Return parameters for tenant filter."""
        return (self.tenant_id,)

class SystemRepository(TenantScopedRepository):
    """System repository with tenant isolation."""

    def get_all(self) -> List[Dict]:
        query = f"""
            SELECT s.* FROM core.system_registry s
            JOIN core.projects p ON s.project_id = p.project_id
            WHERE p.tenant_id = %s
            ORDER BY s.system_name
        """
        return self.db.execute(query, (self.tenant_id,))

    def get_by_id(self, system_id: str) -> Optional[Dict]:
        query = f"""
            SELECT s.* FROM core.system_registry s
            JOIN core.projects p ON s.project_id = p.project_id
            WHERE s.system_id = %s AND p.tenant_id = %s
        """
        rows = self.db.execute(query, (system_id, self.tenant_id))
        return rows[0] if rows else None

class CredentialRepository(TenantScopedRepository):
    """Credential repository with tenant isolation."""

    def get_by_system_id(self, system_id: str) -> Optional[Dict]:
        query = f"""
            SELECT c.* FROM core.system_credentials c
            JOIN core.system_registry s ON c.system_id = s.system_id
            JOIN core.projects p ON s.project_id = p.project_id
            WHERE c.system_id = %s AND p.tenant_id = %s
        """
        rows = self.db.execute(query, (system_id, self.tenant_id))
        return rows[0] if rows else None
```

### API-Level Enforcement

```python
# In route handlers
@router.get("/systems/")
async def list_systems(current_user = Depends(get_current_user)):
    tenant_id = current_user.tenant_id
    repo = SystemRepository(tenant_id)
    return repo.get_all()

@router.get("/systems/{system_id}")
async def get_system(system_id: str, current_user = Depends(get_current_user)):
    tenant_id = current_user.tenant_id
    repo = SystemRepository(tenant_id)
    system = repo.get_by_id(system_id)
    if not system:
        raise HTTPException(status_code=404, detail="System not found")
    return system
```

---

## Automated Onboarding

### Onboarding Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Automated Onboarding Flow                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Step 1: Register Systems                                        │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                   │
│  │  Create   │───▶│  Create   │───▶│  Create   │                   │
│  │  Project  │    │  Source   │    │  Target   │                   │
│  │           │    │  System   │    │  System   │                   │
│  └──────────┘    └──────────┘    └──────────┘                   │
│                                                                   │
│  Step 2: Configure Connections                                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                   │
│  │  Create   │───▶│  Create   │───▶│  Test     │                   │
│  │  Source   │    │  Target   │    │  Both     │                   │
│  │  Creds    │    │  Creds    │    │  Conns    │                   │
│  └──────────┘    └──────────┘    └──────────┘                   │
│                                                                   │
│  Step 3: Discover                                                │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                   │
│  │  Discover │───▶│  Profile  │───▶│  Match    │                   │
│  │  Schema   │    │  Data     │    │  Tables   │                   │
│  └──────────┘    └──────────┘    └──────────┘                   │
│                                                                   │
│  Step 4: Map                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                   │
│  │  Auto-    │───▶│  Review   │───▶│  Confirm  │                   │
│  │  Map      │    │  Mappings │    │  Mappings │                   │
│  └──────────┘    └──────────┘    └──────────┘                   │
│                                                                   │
│  Step 5: Validate                                                │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                   │
│  │  Auto-    │───▶│  Review   │───▶│  Execute  │                   │
│  │  Rules    │    │  Rules    │    │  Validation│                  │
│  └──────────┘    └──────────┘    └──────────┘                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Onboarding Service

```python
class OnboardingService:
    """Orchestrates the automated onboarding process."""

    def __init__(self):
        self.connection_manager = ConnectionManager()
        self.discovery_service = DiscoveryService()
        self.mapping_service = MappingService()
        self.validation_service = ValidationService()

    async def onboard_project(self, project_id: str) -> OnboardingResult:
        """Complete automated onboarding for a project."""

        # Step 1: Validate all systems have connections
        systems = await self.get_project_systems(project_id)
        for system in systems:
            if not await self.has_credentials(system.system_id):
                return OnboardingResult(
                    success=False,
                    step="validate_connections",
                    message=f"System {system.system_name} has no credentials"
                )

        # Step 2: Test all connections
        for system in systems:
            test_result = await self.connection_manager.test_connection(system.system_id)
            if not test_result.success:
                return OnboardingResult(
                    success=False,
                    step="test_connections",
                    message=f"Connection failed for {system.system_name}: {test_result.message}"
                )

        # Step 3: Discover schema
        discovery_result = await self.discovery_service.discover(project_id)

        # Step 4: Auto-map tables
        mapping_result = await self.mapping_service.auto_map(project_id)

        # Step 5: Auto-configure validation rules
        validation_result = await self.validation_service.auto_configure(project_id)

        return OnboardingResult(
            success=True,
            step="complete",
            message="Onboarding complete",
            discovery=mapping_result,
            mappings=mapping_result,
            rules=validation_result
        )
```
