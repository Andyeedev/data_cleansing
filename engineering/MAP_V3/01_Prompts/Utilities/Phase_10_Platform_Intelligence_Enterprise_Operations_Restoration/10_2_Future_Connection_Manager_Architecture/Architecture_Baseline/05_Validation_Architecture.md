# 05 — Validation Architecture

**Phase:** 10.2 — Validation  
**Status:** Pending Final Approval  
**Date:** 03 August 2026  
**Author:** OpenCode (AI Assistant)

---

## Validation Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Validation Architecture                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Validation Levels                         │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  Level 1: Connection Validation                            │   │
│  │  - Can we connect?                                         │   │
│  │  - Are credentials valid?                                  │   │
│  │  - Do we have required permissions?                        │   │
│  │                                                             │   │
│  │  Level 2: Schema Validation                                │   │
│  │  - Do source/target tables exist?                          │   │
│  │  - Do mapped columns exist?                                │   │
│  │  - Are data types compatible?                              │   │
│  │                                                             │   │
│  │  Level 3: Data Validation                                  │   │
│  │  - Row count comparison                                    │   │
│  │  - Checksum/hash comparison                                │   │
│  │  - Statistical profiling                                   │   │
│  │  - Business rule validation                                │   │
│  │                                                             │   │
│  │  Level 4: Governance Validation                            │   │
│  │  - Compliance checks                                       │   │
│  │  - Risk scoring                                            │   │
│  │  - Release gate decisions                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Validation Service

```python
class ValidationService:
    """Orchestrates validation at all levels."""

    async def validate_project(self, project_id: str) -> ValidationResult:
        """Run all validation levels for a project."""

        results = []

        # Level 1: Connection Validation
        connection_results = await self.validate_connections(project_id)
        results.append(connection_results)

        # Level 2: Schema Validation
        schema_results = await self.validate_schema(project_id)
        results.append(schema_results)

        # Level 3: Data Validation
        data_results = await self.validate_data(project_id)
        results.append(data_results)

        # Level 4: Governance Validation
        governance_results = await self.validate_governance(project_id)
        results.append(governance_results)

        return ValidationResult(
            project_id=project_id,
            levels=results,
            overall_status=self._calculate_overall_status(results),
            timestamp=datetime.utcnow()
        )

    async def validate_connections(self, project_id: str) -> LevelResult:
        """Validate all connections for a project."""
        systems = await self.get_project_systems(project_id)
        results = []

        for system in systems:
            test_result = await self.connection_manager.test_connection(system.system_id)
            results.append(ConnectionValidation(
                system=system,
                success=test_result.success,
                message=test_result.message,
                latency_ms=test_result.latency_ms
            ))

        return LevelResult(
            level=1,
            name="Connection Validation",
            passed=all(r.success for r in results),
            results=results
        )
```

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
