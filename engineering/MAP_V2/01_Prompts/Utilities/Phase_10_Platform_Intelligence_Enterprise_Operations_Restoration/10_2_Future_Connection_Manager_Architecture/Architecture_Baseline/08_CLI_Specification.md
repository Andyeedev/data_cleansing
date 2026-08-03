# 08 — CLI Specification

**Phase:** 10.2 — CLI Specification  
**Status:** Pending Final Approval  
**Date:** 03 August 2026  
**Author:** OpenCode (AI Assistant)

---

## CLI Commands

```bash
# Connection Management
map connection test --system-id <uuid>
map connection list --project-id <uuid>
map connection validate --project-id <uuid>

# Discovery
map discover --project-id <uuid>
map discover status --project-id <uuid>

# Mapping
map mapping auto --project-id <uuid>
map mapping list --project-id <uuid>
map mapping validate --mapping-id <uuid>

# Validation
map validate --project-id <uuid>
map validate connections --project-id <uuid>
map validate schema --project-id <uuid>
map validate data --project-id <uuid>

# Full Pipeline
map onboard --project-id <uuid>
map run --project-id <uuid>
map run --project-id <uuid> --resume-batch <uuid>
map run --project-id <uuid> --recovery

# Platform Diagnostics
map doctor
```

---

## map doctor — Platform Diagnostics

```bash
$ map doctor

✓ Adapters
  postgres ........... registered
  sqlserver .......... registered
  mysql .............. registered
  oracle ............. registered
  snowflake .......... registered
  bigquery ........... registered
  databricks ......... registered

✓ Connection Pools
  active pools ....... 3
  total connections ... 12
  health ............. OK

✓ Metadata
  projects ........... 5
  systems ............ 12
  credentials ........ 12
  mappings ........... 8

✓ Credentials
  valid .............. 10
  expired ............ 1
  missing ............ 1

✓ Discovery
  last run ........... 2026-08-03 14:32 UTC
  snapshots .......... 23
  drift detected ..... 2

✓ Validation
  rules active ....... 45
  last run ........... 2026-08-03 14:30 UTC
  failures ........... 0

✓ Encryption
  key source ......... EnvironmentKeySource
  status ............. OK

Audit: 2026-08-03T14:35:00Z | 7 checks passed | 0 warnings | 0 errors
```

**Purpose:** Production support — one command to verify platform health.

---

## CLI Integration Points

```python
# app/main.py additions

@app.command()
def connection_test(system_id: str):
    """Test connection to a system."""
    manager = ConnectionManager()
    result = manager.test_connection(system_id)
    if result.success:
        print(f"Connection successful ({result.latency_ms}ms)")
    else:
        print(f"Connection failed: {result.message}")
        sys.exit(1)

@app.command()
def discover(project_id: str):
    """Discover schema for a project."""
    service = DiscoveryService()
    result = service.discover(project_id)
    print(f"Discovered {len(result.datasets)} dataset pairs")
    for dataset in result.datasets:
        print(f"  {dataset.source_tables} → {dataset.target_tables}")

@app.command()
def onboard(project_id: str):
    """Run automated onboarding for a project."""
    service = OnboardingService()
    result = service.onboard_project(project_id)
    if result.success:
        print("Onboarding complete")
    else:
        print(f"Onboarding failed at {result.step}: {result.message}")
        sys.exit(1)
```
