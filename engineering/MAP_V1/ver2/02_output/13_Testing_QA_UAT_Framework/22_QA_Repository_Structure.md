# QA Repository Structure for MAP

| Field | Value |
|---|---|
| **Document Title** | QA Repository Structure for MAP (Migration Assurance Platform) |
| **Version** | 1.0 |
| **Date** | July 2026 |
| **Status** | Official |
| **Classification** | Internal / Confidential |
| **Owner** | MAP Quality Engineering Team |
| **Approved By** | MAP Architecture Review Board |
| **Last Revised** | 02 July 2026 |
| **Review Cycle** | Quarterly |

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Scope](#2-scope)
3. [Folder Structure](#3-folder-structure)
4. [Root Test Directory — tests/](#4-root-test-directory--tests)
5. [Unit Tests — unit/](#5-unit-tests--unit)
6. [Integration Tests — integration/](#6-integration-tests--integration)
7. [System Tests — system/](#7-system-tests--system)
8. [Performance Tests — performance/](#8-performance-tests--performance)
9. [Security Tests — security/](#9-security-tests--security)
10. [UAT Tests — uat/](#10-uat-tests--uat)
11. [Test Data — test-data/](#11-test-data--test-data)
12. [Test Reports — reports/](#12-test-reports--reports)
13. [Automation Framework — automation/](#13-automation-framework--automation)
14. [Test Fixtures — fixtures/](#14-test-fixtures--fixtures)
15. [Naming Conventions](#15-naming-conventions)
16. [File Organization Strategies](#16-file-organization-strategies)
17. [Configuration Files](#17-configuration-files)
18. [CI/CD Integration](#18-cicd-integration)
19. [Best Practices](#19-best-practices)
20. [Dependencies](#20-dependencies)
21. [Directory Tree Reference](#21-directory-tree-reference)
22. [Revision History](#22-revision-history)
23. [Approval](#23-approval)

---

## 1. Purpose

This document defines the **QA repository structure** for the Migration Assurance Platform (MAP). It provides a comprehensive, enterprise-grade layout for organizing test assets, ensuring consistency, maintainability, and scalability across all quality assurance activities.

### 1.1 Objectives

| # | Objective | Description |
|---|-----------|-------------|
| O1 | Standardization | Establish uniform directory layout for all QA repositories |
| O2 | Maintainability | Enable long-term sustainability of test suites |
| O3 | Discoverability | Ensure team members can locate test assets quickly |
| O4 | Scalability | Support growth from hundreds to thousands of test cases |
| O5 | Compliance | Align with Batch 11 Repository Structure and Coding Standards |
| O6 | Automation | Provide structure optimized for CI/CD integration |

### 1.2 Key Principles

- **Separation of Concerns:** Each test type occupies its own directory
- **Feature Coherence:** Related files cluster by feature, not by type
- **Convention Over Configuration:** Follow established naming patterns
- **Minimal Duplication:** Shared utilities and fixtures are centralized
- **Versioned Artifacts:** Test data and reports are reproducible

---

## 2. Scope

This document covers:

| In Scope | Out of Scope |
|----------|--------------|
| Directory structure for all test types | Application source code structure |
| File naming conventions | CI/CD pipeline internals |
| Test data management | Production deployment procedures |
| Configuration file standards | Test case authoring techniques |
| CI/CD integration patterns | Team roles and responsibilities |
| Best practices for organization | Individual tool configuration |

---

## 3. Folder Structure

### 3.1 Complete Directory Tree

```
qa-repository/
├── .github/
│   └── workflows/
│       ├── ci-unit-tests.yml
│       ├── ci-integration-tests.yml
│       ├── ci-performance-tests.yml
│       ├── ci-security-tests.yml
│       └── ci-uat-tests.yml
├── tests/
│   ├── unit/
│   │   ├── backend/
│   │   │   ├── api/
│   │   │   │   ├── controllers/
│   │   │   │   ├── services/
│   │   │   │   ├── middleware/
│   │   │   │   └── repositories/
│   │   │   ├── workers/
│   │   │   └── shared/
│   │   ├── frontend/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   └── utils/
│   │   ├── ai/
│   │   │   ├── models/
│   │   │   ├── prompts/
│   │   │   └── pipelines/
│   │   └── shared/
│   │       ├── validators/
│   │       └── helpers/
│   ├── integration/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   ├── middleware/
│   │   │   └── database/
│   │   ├── services/
│   │   │   ├── migration/
│   │   │   ├── validation/
│   │   │   └── reporting/
│   │   ├── external/
│   │   │   ├── azure-ad/
│   │   │   ├── blob-storage/
│   │   │   └── service-bus/
│   │   └── ai/
│   │       ├── model-integration/
│   │       └── pipeline-integration/
│   ├── system/
│   │   ├── end-to-end/
│   │   │   ├── migration-flows/
│   │   │   ├── validation-flows/
│   │   │   └── reporting-flows/
│   │   ├── regression/
│   │   │   ├── critical-paths/
│   │   │   └── smoke/
│   │   └── acceptance/
│   │       ├── business-rules/
│   │       └── regulatory/
│   ├── performance/
│   │   ├── load/
│   │   │   ├── scripts/
│   │   │   ├── configs/
│   │   │   └── baselines/
│   │   ├── stress/
│   │   │   ├── scripts/
│   │   │   └── thresholds/
│   │   ├── endurance/
│   │   └── spike/
│   ├── security/
│   │   ├── vulnerability/
│   │   │   ├── sast/
│   │   │   ├── dast/
│   │   │   └── sca/
│   │   ├── penetration/
│   │   │   ├── web/
│   │   │   ├── api/
│   │   │   └── infrastructure/
│   │   ├── compliance/
│   │   │   ├── owasp/
│   │   │   ├── pci-dss/
│   │   │   └── gdpr/
│   │   └── authentication/
│   │       ├── oauth/
│   │       ├── rbac/
│   │       └── session/
│   ├── uat/
│   │   ├── scenarios/
│   │   │   ├── migration/
│   │   │   ├── validation/
│   │   │   ├── reporting/
│   │   │   └── administration/
│   │   ├── test-cases/
│   │   │   ├── manual/
│   │   │   └── automated/
│   │   ├── user-flows/
│   │   └── sign-off/
│   ├── test-data/
│   │   ├── fixtures/
│   │   │   ├── migrations/
│   │   │   ├── validations/
│   │   │   └── reports/
│   │   ├── seed/
│   │   │   ├── database/
│   │   │   └── api/
│   │   ├── mocks/
│   │   │   ├── responses/
│   │   │   └── services/
│   │   ├── factories/
│   │   └── snapshots/
│   │       ├── expected/
│   │       └── actual/
│   ├── reports/
│   │   ├── junit/
│   │   ├── coverage/
│   │   ├── allure/
│   │   ├── performance/
│   │   │   ├── k6/
│   │   │   └── jmeter/
│   │   ├── security/
│   │   └── archived/
│   ├── automation/
│   │   ├── frameworks/
│   │   │   ├── playwright/
│   │   │   ├── pytest/
│   │   │   └── k6/
│   │   ├── helpers/
│   │   │   ├── api/
│   │   │   ├── database/
│   │   │   └── utils/
│   │   ├── pages/
│   │   │   ├── migration/
│   │   │   ├── validation/
│   │   │   ├── reporting/
│   │   │   └── admin/
│   │   ├── step-definitions/
│   │   └── runners/
│   │       ├── parallel/
│   │       └── sequential/
│   └── fixtures/
│       ├── conftest/
│       │   ├── api_fixtures.py
│       │   ├── database_fixtures.py
│       │   ├── ai_fixtures.py
│       │   └── authentication_fixtures.py
│       ├── factories/
│       │   ├── user_factory.py
│       │   ├── migration_factory.py
│       │   └── validation_factory.py
│       └── seed/
│           ├── seed_data.py
│           └── cleanup.py
├── configuration/
│   ├── pytest.ini
│   ├── conftest.py
│   ├── playwright.config.ts
│   ├── tsconfig.json
│   ├── .env.test
│   ├── k6.config.js
│   └── zap.config.yaml
├── scripts/
│   ├── setup-test-env.sh
│   ├── run-tests.sh
│   ├── generate-report.sh
│   ├── cleanup-test-data.sh
│   └── seed-test-data.sh
├── docs/
│   ├── test-plans/
│   ├── test-cases/
│   └── guidelines/
├── .gitignore
├── .editorconfig
├── README.md
├── requirements.txt
├── package.json
└── Dockerfile.test
```

### 3.2 Directory Purpose Summary

| Directory | Purpose | Primary Users |
|-----------|---------|---------------|
| `tests/unit/` | Isolated component tests | Developers |
| `tests/integration/` | Component interaction tests | QA Engineers |
| `tests/system/` | End-to-end workflow tests | QA Leads |
| `tests/performance/` | Load, stress, endurance tests | Performance Engineers |
| `tests/security/` | Vulnerability and compliance tests | Security Team |
| `tests/uat/` | Business acceptance scenarios | Business Analysts |
| `tests/test-data/` | Shared test datasets | All QA Members |
| `tests/reports/` | Generated test reports | All Stakeholders |
| `tests/automation/` | Reusable automation code | Automation Engineers |
| `tests/fixtures/` | Shared test fixtures | All Developers |
| `configuration/` | Tool configuration files | DevOps / QA Leads |
| `scripts/` | Utility and helper scripts | DevOps / QA Engineers |

---

## 4. Root Test Directory — tests/

### 4.1 Purpose

The `tests/` directory serves as the single source of truth for all quality assurance assets in the MAP platform. Every test file, fixture, and test-related resource resides under this directory.

### 4.2 Rules

| Rule | Description |
|------|-------------|
| RT-01 | All test code MUST live under `tests/` — no test files in `src/` |
| RT-02 | Each subdirectory MUST correspond to exactly one test type |
| RT-03 | Shared utilities MUST be in `automation/helpers/` or `tests/fixtures/` |
| RT-04 | Test data MUST be version-controlled in `tests/test-data/` |
| RT-05 | Generated reports MUST go to `tests/reports/` and be gitignored |

### 4.3 Entry Points

Each test type has its own entry point configuration:

```python
# configuration/pytest.ini
[pytest]
testpaths = tests/unit tests/integration tests/system
markers =
    unit: Unit tests
    integration: Integration tests
    system: System tests
    performance: Performance tests
    security: Security tests
    uat: User acceptance tests
    smoke: Smoke tests
    regression: Regression tests
```

---

## 5. Unit Tests — unit/

### 5.1 Purpose

Unit tests verify individual components in isolation. They test the smallest testable parts of the application — functions, methods, classes, and modules — without external dependencies.

### 5.2 Directory Layout

```
tests/unit/
├── backend/
│   ├── api/
│   │   ├── controllers/
│   │   │   ├── test_migration_controller.py
│   │   │   ├── test_validation_controller.py
│   │   │   └── test_reporting_controller.py
│   │   ├── services/
│   │   │   ├── test_migration_service.py
│   │   │   ├── test_validation_service.py
│   │   │   ├── test_notification_service.py
│   │   │   └── test_file_processor.py
│   │   ├── middleware/
│   │   │   ├── test_auth_middleware.py
│   │   │   └── test_error_handler.py
│   │   └── repositories/
│   │       ├── test_migration_repository.py
│   │       └── test_validation_repository.py
│   ├── workers/
│   │   ├── test_migration_worker.py
│   │   └── test_scheduled_task_worker.py
│   └── shared/
│       ├── validators/
│       │   ├── test_input_validator.py
│       │   └── test_schema_validator.py
│       └── helpers/
│           ├── test_date_utils.py
│           ├── test_string_utils.py
│           └── test_file_utils.py
├── frontend/
│   ├── components/
│   │   ├── MigrationDashboard.test.tsx
│   │   ├── ValidationStatus.test.tsx
│   │   └── ReportViewer.test.tsx
│   ├── hooks/
│   │   ├── useMigrations.test.ts
│   │   └── useValidation.test.ts
│   ├── pages/
│   │   ├── MigrationPage.test.tsx
│   │   └── DashboardPage.test.tsx
│   └── utils/
│       ├── formatters.test.ts
│       └── apiClient.test.ts
├── ai/
│   ├── models/
│   │   ├── test_data_classifier.py
│   │   └── test_anomaly_detector.py
│   ├── prompts/
│   │   ├── test_migration_prompts.py
│   │   └── test_validation_prompts.py
│   └── pipelines/
│       ├── test_training_pipeline.py
│       └── test_inference_pipeline.py
└── shared/
    ├── validators/
    │   └── test_financial_validators.py
    └── helpers/
        └── test_compliance_utils.py
```

### 5.3 Naming Convention

| Element | Pattern | Example |
|---------|---------|---------|
| Test file | `test_{module_name}.py` | `test_migration_service.py` |
| Test class | `Test{ClassName}` | `TestMigrationService` |
| Test method | `test_{action}_{scenario}` | `test_validate_migration_returns_success` |
| Frontend test | `{ComponentName}.test.tsx` | `MigrationDashboard.test.tsx` |
| Frontend hook | `{hookName}.test.ts` | `useMigrations.test.ts` |

### 5.4 Example Test Structure

```python
# tests/unit/backend/api/services/test_migration_service.py

import pytest
from unittest.mock import Mock, AsyncMock, patch
from datetime import datetime, timezone

from src.backend.api.services.migration_service import MigrationService
from src.backend.api.models.migration import Migration, MigrationStatus
from src.backend.api.exceptions import MigrationNotFoundError


class TestMigrationService:
    """Unit tests for MigrationService."""

    @pytest.fixture
    def mock_repository(self):
        return Mock(spec=MigrationRepository)

    @pytest.fixture
    def service(self, mock_repository):
        return MigrationService(repository=mock_repository)

    @pytest.mark.asyncio
    async def test_start_migration_returns_created_migration(self, service, mock_repository):
        # Arrange
        mock_repository.create_async.return_value = Migration(
            id="mig-001",
            status=MigrationStatus.Created,
            created_at=datetime.now(timezone.utc)
        )

        # Act
        result = await service.start_migration_async(name="Customer Migration")

        # Assert
        assert result.id == "mig-001"
        assert result.status == MigrationStatus.Created
        mock_repository.create_async.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_migration_raises_when_not_found(self, service, mock_repository):
        # Arrange
        mock_repository.get_by_id_async.return_value = None

        # Act & Assert
        with pytest.raises(MigrationNotFoundError):
            await service.get_migration_async("nonexistent-id")

    @pytest.mark.asyncio
    async def test_validate_migration_completes_successfully(self, service, mock_repository):
        # Arrange
        mock_repository.get_by_id_async.return_value = Migration(
            id="mig-001",
            status=MigrationStatus.InProgress
        )
        mock_repository.update_status_async.return_value = True

        # Act
        result = await service.validate_migration_async("mig-001")

        # Assert
        assert result is True
        mock_repository.update_status_async.assert_called_once_with(
            "mig-001", MigrationStatus.Validated
        )
```

### 5.5 Unit Test Rules

| Rule | Description |
|------|-------------|
| UT-01 | Unit tests MUST complete in under 100ms each |
| UT-02 | External dependencies MUST be mocked (database, API, filesystem) |
| UT-03 | Each test MUST be independent — no shared state between tests |
| UT-04 | Use Arrange-Act-Assert (AAA) pattern consistently |
| UT-05 | Test both success and failure paths |
| UT-06 | Test boundary conditions and edge cases |
| UT-07 | Maintain minimum 90% code coverage for business logic |

---

## 6. Integration Tests — integration/

### 6.1 Purpose

Integration tests verify that multiple components work together correctly. They test service-to-service communication, database interactions, and external API integrations.

### 6.2 Directory Layout

```
tests/integration/
├── api/
│   ├── endpoints/
│   │   ├── test_migration_endpoints.py
│   │   ├── test_validation_endpoints.py
│   │   ├── test_reporting_endpoints.py
│   │   └── test_admin_endpoints.py
│   ├── middleware/
│   │   ├── test_auth_flow.py
│   │   ├── test_rate_limiting.py
│   │   └── test_error_handling.py
│   └── database/
│       ├── test_migration_crud.py
│       ├── test_validation_crud.py
│       ├── test_connection_pool.py
│       └── test_migration_scripts.py
├── services/
│   ├── migration/
│   │   ├── test_migration_lifecycle.py
│   │   ├── test_file_processing_pipeline.py
│   │   └── test_batch_operations.py
│   ├── validation/
│   │   ├── test_validation_pipeline.py
│   │   ├── test_rule_engine_integration.py
│   │   └── test_result_aggregation.py
│   └── reporting/
│       ├── test_report_generation.py
│       ├── test_export_formats.py
│       └── test_scheduled_reports.py
├── external/
│   ├── azure-ad/
│   │   ├── test_oauth_flow.py
│   │   ├── test_token_refresh.py
│   │   └── test_role_assignment.py
│   ├── blob-storage/
│   │   ├── test_file_upload.py
│   │   ├── test_file_download.py
│   │   └── test_file_streaming.py
│   └── service-bus/
│       ├── test_message_publish.py
│       ├── test_message_consume.py
│       └── test_dead_letter_queue.py
└── ai/
    ├── model-integration/
    │   ├── test_model_loading.py
    │   ├── test_prediction_pipeline.py
    │   └── test_model_caching.py
    └── pipeline-integration/
        ├── test_data_pipeline.py
        └── test_feature_extraction.py
```

### 6.3 Example Integration Test

```python
# tests/integration/api/database/test_migration_crud.py

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession

from src.backend.api.main import app
from src.backend.api.database import get_db_session


@pytest_asyncio.fixture
async def client(db_session: AsyncSession):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.mark.integration
class TestMigrationCRUD:
    """Integration tests for Migration CRUD operations."""

    @pytest.mark.asyncio
    async def test_create_migration_persists_to_database(self, client: AsyncClient):
        # Arrange
        payload = {
            "name": "Integration Test Migration",
            "source": "legacy_system",
            "target": "modern_system",
            "recordCount": 1000
        }

        # Act
        response = await client.post("/api/v1/migrations", json=payload)

        # Assert
        assert response.status_code == 201
        data = response.json()
        assert data["id"] is not None
        assert data["name"] == "Integration Test Migration"
        assert data["status"] == "Created"

    @pytest.mark.asyncio
    async def test_get_migration_returns_stored_data(self, client: AsyncClient, sample_migration):
        # Act
        response = await client.get(f"/api/v1/migrations/{sample_migration.id}")

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == sample_migration.id
        assert data["name"] == sample_migration.name

    @pytest.mark.asyncio
    async def test_update_migration_modifies_database(self, client: AsyncClient, sample_migration):
        # Arrange
        payload = {"status": "InProgress"}

        # Act
        response = await client.patch(
            f"/api/v1/migrations/{sample_migration.id}",
            json=payload
        )

        # Assert
        assert response.status_code == 200
        assert response.json()["status"] == "InProgress"

    @pytest.mark.asyncio
    async def test_delete_migration_removes_from_database(self, client: AsyncClient, sample_migration):
        # Act
        delete_response = await client.delete(f"/api/v1/migrations/{sample_migration.id}")
        get_response = await client.get(f"/api/v1/migrations/{sample_migration.id}")

        # Assert
        assert delete_response.status_code == 204
        assert get_response.status_code == 404
```

### 6.4 Integration Test Rules

| Rule | Description |
|------|-------------|
| IT-01 | Integration tests MUST use test databases (not production) |
| IT-02 | Tests MUST clean up after themselves (delete created records) |
| IT-03 | Use realistic test data that reflects production patterns |
| IT-04 | Test timeout MUST be 30 seconds per test |
| IT-05 | Mark tests with appropriate markers: `@pytest.mark.integration` |
| IT-06 | Mock external services only when absolutely necessary |

---

## 7. System Tests — system/

### 7.1 Purpose

System tests validate complete workflows from end to end, simulating real user scenarios across all application layers.

### 7.2 Directory Layout

```
tests/system/
├── end-to-end/
│   ├── migration-flows/
│   │   ├── test_complete_migration_flow.py
│   │   ├── test_multi_source_migration.py
│   │   ├── test_large_dataset_migration.py
│   │   └── test_failed_migration_recovery.py
│   ├── validation-flows/
│   │   ├── test_full_validation_workflow.py
│   │   ├── test_rule_based_validation.py
│   │   ├── test_ai_assisted_validation.py
│   │   └── test_validation_with_corrections.py
│   └── reporting-flows/
│       ├── test_executive_dashboard_flow.py
│       ├── test_compliance_report_flow.py
│       └── test_audit_trail_flow.py
├── regression/
│   ├── critical-paths/
│   │   ├── test_migration_critical_path.py
│   │   ├── test_validation_critical_path.py
│   │   └── test_user_authentication_path.py
│   └── smoke/
│       ├── test_application_starts.py
│       ├── test_database_connects.py
│       └── test_health_endpoints.py
└── acceptance/
    ├── business-rules/
    │   ├── test_financial_data_accuracy.py
    │   ├── test_regulatory_compliance.py
    │   └── test_audit_requirements.py
    └── regulatory/
        ├── test_pci_compliance.py
        ├── test_gdpr_compliance.py
        └── test_sox_compliance.py
```

### 7.3 Example System Test (Playwright)

```python
# tests/system/end-to-end/migration-flows/test_complete_migration_flow.py

import pytest
from playwright.async_api import Page, expect


@pytest.mark.system
@pytest.mark.e2e
class TestCompleteMigrationFlow:
    """End-to-end tests for complete migration workflow."""

    async def test_create_and_execute_migration(self, page: Page, auth_context):
        # Arrange
        await page.goto("/login")
        await page.fill('[data-testid="email"]', auth_context.email)
        await page.fill('[data-testid="password"]', auth_context.password)
        await page.click('[data-testid="login-button"]')
        await page.wait_for_url("/dashboard")

        # Act - Navigate to migrations
        await page.click('[data-testid="nav-migrations"]')
        await page.click('[data-testid="create-migration-button"]')

        # Fill migration form
        await page.fill('[data-testid="migration-name"]', "E2E Test Migration")
        await page.select_option('[data-testid="source-type"]', "database")
        await page.fill('[data-testid="source-connection"]', "Server=.;Database=LegacyDB")
        await page.select_option('[data-testid="target-type"]', "database")
        await page.fill('[data-testid="target-connection"]', "Server=.;Database=ModernDB")

        # Start migration
        await page.click('[data-testid="start-migration-button"]')

        # Assert - Verify migration started
        await expect(page.locator('[data-testid="migration-status"]')).to_have_text("InProgress")
        await expect(page.locator('[data-testid="progress-bar"]')).to_be_visible()

        # Wait for completion (with timeout)
        await page.wait_for_selector(
            '[data-testid="migration-status"]',
            state="hidden",
            timeout=300000  # 5 minutes
        )

        # Verify success
        await expect(page.locator('[data-testid="migration-status"]')).to_have_text("Completed")
        await expect(page.locator('[data-testid="records-processed"]')).to_have_text("1000")
```

### 7.4 System Test Rules

| Rule | Description |
|------|-------------|
| ST-01 | System tests MUST cover critical business workflows |
| ST-02 | Use `@pytest.mark.system` marker for all system tests |
| ST-03 | System tests MAY use Playwright for UI scenarios |
| ST-04 | Maintain separate test environments for system testing |
| ST-05 | System tests MUST NOT run on every commit (CI nightly only) |
| ST-06 | Document test environment requirements in README |

---

## 8. Performance Tests — performance/

### 8.1 Purpose

Performance tests measure system behavior under various load conditions, ensuring MAP meets performance requirements for financial services workloads.

### 8.2 Directory Layout

```
tests/performance/
├── load/
│   ├── scripts/
│   │   ├── migration_load_test.js
│   │   ├── validation_load_test.js
│   │   ├── concurrent_user_load.js
│   │   └── api_endpoint_load.js
│   ├── configs/
│   │   ├── migration_load_config.json
│   │   ├── validation_load_config.json
│   │   └── baseline_config.json
│   └── baselines/
│       ├── migration_baseline.json
│       ├── validation_baseline.json
│       └── api_baseline.json
├── stress/
│   ├── scripts/
│   │   ├── migration_stress_test.js
│   │   └── database_stress_test.js
│   └── thresholds/
│       ├── response_time_thresholds.json
│       └── error_rate_thresholds.json
├── endurance/
│   ├── scripts/
│   │   ├── migration_endurance_test.js
│   │   └── memory_leak_test.js
│   └── configs/
│       └── endurance_config.json
└── spike/
    ├── scripts/
    │   └── migration_spike_test.js
    └── configs/
        └── spike_config.json
```

### 8.3 Example k6 Performance Test

```javascript
// tests/performance/load/scripts/migration_load_test.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const migrationDuration = new Trend('migration_duration');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 10 },   // Ramp up to 10 users
    { duration: '5m', target: 10 },   // Stay at 10 users
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '3m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests under 500ms
    errors: ['rate<0.01'],              // Error rate under 1%
    migration_duration: ['p(99)<30000'], // 99% of migrations under 30s
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://api.map-platform.dev';

// Authentication setup
function getAuthToken() {
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: __ENV.TEST_EMAIL,
    password: __ENV.TEST_PASSWORD,
  }), { headers: { 'Content-Type': 'application/json' } });

  return loginRes.json('access_token');
}

export function setup() {
  const token = getAuthToken();
  return { token };
}

export default function (data) {
  const headers = {
    'Authorization': `Bearer ${data.token}`,
    'Content-Type': 'application/json',
  };

  // Create migration
  const createPayload = JSON.stringify({
    name: `Load Test Migration ${Date.now()}`,
    source: 'database',
    target: 'database',
    recordCount: 10000,
  });

  const createRes = http.post(`${BASE_URL}/api/v1/migrations`, createPayload, { headers });
  
  check(createRes, {
    'migration created': (r) => r.status === 201,
    'has migration id': (r) => r.json('id') !== undefined,
  });

  if (createRes.status !== 201) {
    errorRate.add(1);
    return;
  }

  const migrationId = createRes.json('id');

  // Poll migration status
  let completed = false;
  const startTime = Date.now();
  const maxWaitTime = 60000; // 60 seconds

  while (!completed && (Date.now() - startTime) < maxWaitTime) {
    sleep(2);
    
    const statusRes = http.get(`${BASE_URL}/api/v1/migrations/${migrationId}`, { headers });
    
    check(statusRes, {
      'status check successful': (r) => r.status === 200,
    });

    if (statusRes.status === 200) {
      const status = statusRes.json('status');
      if (status === 'Completed' || status === 'Failed') {
        completed = true;
        migrationDuration.add(Date.now() - startTime);
      }
    }
  }

  sleep(1); // Think time
}

export function teardown(data) {
  // Cleanup test data if needed
}
```

### 8.4 Performance Test Rules

| Rule | Description |
|------|-------------|
| PT-01 | Performance tests MUST run in isolated environments |
| PT-02 | Establish baselines before running load tests |
| PT-03 | Define clear SLA thresholds for pass/fail criteria |
| PT-04 | Capture metrics: response time, throughput, error rate, resource utilization |
| PT-05 | Run performance tests against production-like data volumes |
| PT-06 | Document performance test results in reports/performance/ |

---

## 9. Security Tests — security/

### 9.1 Purpose

Security tests identify vulnerabilities, verify compliance with financial regulations, and ensure proper authentication and authorization controls.

### 9.2 Directory Layout

```
tests/security/
├── vulnerability/
│   ├── sast/
│   │   ├── bandit_config.yaml
│   │   ├── sonarqube_config.yaml
│   │   └── custom_rules.yaml
│   ├── dast/
│   │   ├── zap_config.yaml
│   │   ├── zap_scan_rules.yaml
│   │   └── baseline_scan.py
│   └── sca/
│       ├── safety_config.yaml
│       └── npm_audit_config.json
├── penetration/
│   ├── web/
│   │   ├── test_xss_vulnerabilities.py
│   │   ├── test_sql_injection.py
│   │   ├── test_csrf_protection.py
│   │   └── test_path_traversal.py
│   ├── api/
│   │   ├── test_rate_limiting.py
│   │   ├── test_input_validation.py
│   │   ├── test_authentication_bypass.py
│   │   └── test_authorization_enforcement.py
│   └── infrastructure/
│       ├── test_ssl_configuration.py
│       ├── test_header_security.py
│       └── test_cors_policy.py
├── compliance/
│   ├── owasp/
│   │   ├── test_owasp_top_10.py
│   │   └── owasp_checklist.yaml
│   ├── pci-dss/
│   │   ├── test_card_data_handling.py
│   │   ├── test_encryption_standards.py
│   │   └── pci_compliance_checklist.yaml
│   └── gdpr/
│       ├── test_data_privacy.py
│       ├── test_consent_management.py
│       └── gdpr_compliance_checklist.yaml
└── authentication/
    ├── oauth/
    │   ├── test_token_generation.py
    │   ├── test_token_validation.py
    │   └── test_token_expiry.py
    ├── rbac/
    │   ├── test_role_assignment.py
    │   ├── test_permission_enforcement.py
    │   └── test_admin_access.py
    └── session/
        ├── test_session_management.py
        ├── test_session_expiry.py
        └── test_concurrent_sessions.py
```

### 9.3 Example Security Test

```python
# tests/security/authentication/rbac/test_permission_enforcement.py

import pytest
from httpx import AsyncClient


@pytest.mark.security
class TestRBACPermissionEnforcement:
    """Tests for Role-Based Access Control enforcement."""

    @pytest.mark.asyncio
    async def test_anonymous_user_cannot_access_protected_endpoints(self, client: AsyncClient):
        """Verify unauthenticated requests are rejected."""
        endpoints = [
            "/api/v1/migrations",
            "/api/v1/validations",
            "/api/v1/reports",
            "/api/v1/admin/users",
        ]

        for endpoint in endpoints:
            response = await client.get(endpoint)
            assert response.status_code == 401, f"{endpoint} should require authentication"

    @pytest.mark.asyncio
    async def test_viewer_cannot_create_migration(self, viewer_client: AsyncClient):
        """Verify viewer role cannot perform write operations."""
        payload = {
            "name": "Unauthorized Migration",
            "source": "database",
            "target": "database",
        }

        response = await viewer_client.post("/api/v1/migrations", json=payload)
        assert response.status_code == 403

    @pytest.mark.asyncio
    async def test_viewer_cannot_access_admin_endpoints(self, viewer_client: AsyncClient):
        """Verify viewer role cannot access admin functionality."""
        admin_endpoints = [
            "/api/v1/admin/users",
            "/api/v1/admin/roles",
            "/api/v1/admin/settings",
            "/api/v1/admin/audit-logs",
        ]

        for endpoint in admin_endpoints:
            response = await viewer_client.get(endpoint)
            assert response.status_code == 403, f"{endpoint} should be admin-only"

    @pytest.mark.asyncio
    async def test_admin_can_manage_users(self, admin_client: AsyncClient):
        """Verify admin role can perform user management."""
        # Get users
        response = await admin_client.get("/api/v1/admin/users")
        assert response.status_code == 200

        # Create user
        payload = {
            "email": "newuser@test.com",
            "role": "viewer",
        }
        response = await admin_client.post("/api/v1/admin/users", json=payload)
        assert response.status_code == 201

    @pytest.mark.asyncio
    async def test_user_cannot_escalate_own_role(self, viewer_client: AsyncClient):
        """Verify users cannot elevate their own privileges."""
        payload = {"role": "admin"}

        response = await viewer_client.patch("/api/v1/users/me/role", json=payload)
        assert response.status_code in [403, 405]
```

### 9.4 Security Test Rules

| Rule | Description |
|------|-------------|
| SEC-01 | Security tests MUST run weekly and before each release |
| SEC-02 | SAST scans MUST be integrated into CI/CD pipeline |
| SEC-03 | DAST scans MUST run against staging environments |
| SEC-04 | SCA scans MUST check for known vulnerabilities in dependencies |
| SEC-05 | Penetration tests MUST be conducted quarterly by security team |
| SEC-06 | Security findings MUST be tracked as high-priority defects |

---

## 10. UAT Tests — uat/

### 10.1 Purpose

UAT tests validate that the system meets business requirements and is ready for production deployment. They bridge the gap between technical testing and business acceptance.

### 10.2 Directory Layout

```
tests/uat/
├── scenarios/
│   ├── migration/
│   │   ├── scenario_01_single_source_migration.py
│   │   ├── scenario_02_multi_source_migration.py
│   │   ├── scenario_03_large_dataset_migration.py
│   │   ├── scenario_04_migration_with_corrections.py
│   │   ├── scenario_05_failed_migration_recovery.py
│   │   └── scenario_06_scheduled_migration.py
│   ├── validation/
│   │   ├── scenario_01_rule_based_validation.py
│   │   ├── scenario_02_ai_assisted_validation.py
│   │   ├── scenario_03_validation_with_overrides.py
│   │   └── scenario_04_bulk_validation.py
│   ├── reporting/
│   │   ├── scenario_01_executive_dashboard.py
│   │   ├── scenario_02_compliance_report.py
│   │   ├── scenario_03_audit_trail.py
│   │   └── scenario_04_custom_report.py
│   └── administration/
│       ├── scenario_01_user_management.py
│       ├── scenario_02_role_configuration.py
│       ├── scenario_03_system_settings.py
│       └── scenario_04_notification_management.py
├── test-cases/
│   ├── manual/
│   │   ├── TC_MIGRATION_001.md
│   │   ├── TC_MIGRATION_002.md
│   │   ├── TC_VALIDATION_001.md
│   │   └── TC_REPORTING_001.md
│   └── automated/
│       ├── test_uat_migration_flow.py
│       ├── test_uat_validation_flow.py
│       └── test_uat_reporting_flow.py
├── user-flows/
│   ├── flow_analyst_migration.yaml
│   ├── flow_analyst_validation.yaml
│   ├── flow_manager_review.yaml
│   └── flow_admin_configuration.yaml
└── sign-off/
    ├── uat_sign_off_template.md
    ├── uat_execution_log.md
    └── uat_defect_tracker.md
```

### 10.3 Example UAT Test Case

```python
# tests/uat/scenarios/migration/scenario_01_single_source_migration.py

import pytest
from playwright.async_api import Page, expect


@pytest.mark.uat
@pytest.mark.scenario
class TestScenario01SingleSourceMigration:
    """
    Scenario: Single Source Migration
    
    As an analyst,
    I want to migrate data from a single legacy database to the modern system,
    So that I can consolidate data into a single platform.
    
    Preconditions:
    - User is authenticated as analyst
    - Source database is accessible
    - Target database is empty
    
    Test Data:
    - Source: LegacyCRM database (1000 records)
    - Target: ModernCRM database
    """

    async def test_happy_path_migration(self, page: Page, analyst_context):
        """Verify successful migration through complete workflow."""
        
        # Step 1: Login
        await page.goto("/login")
        await page.fill('[data-testid="email"]', analyst_context.email)
        await page.fill('[data-testid="password"]', analyst_context.password)
        await page.click('[data-testid="login-button"]')
        await page.wait_for_url("/dashboard")
        
        # Step 2: Navigate to Migration
        await page.click('[data-testid="nav-migrations"]')
        await expect(page.locator('[data-testid="migrations-list"]')).to_be_visible()
        
        # Step 3: Create New Migration
        await page.click('[data-testid="create-migration-button"]')
        await expect(page.locator('[data-testid="migration-form"]')).to_be_visible()
        
        # Step 4: Configure Migration
        await page.fill('[data-testid="migration-name"]', "UAT Single Source Migration")
        await page.select_option('[data-testid="source-type"]', "database")
        await page.fill('[data-testid="source-server"]', "LEGACY-SQL-01")
        await page.fill('[data-testid="source-database"]', "LegacyCRM")
        await page.select_option('[data-testid="target-type"]', "database")
        await page.fill('[data-testid="target-server"]', "MODERN-SQL-01")
        await page.fill('[data-testid="target-database"]', "ModernCRM")
        
        # Step 5: Preview and Start
        await page.click('[data-testid="preview-migration-button"]')
        await expect(page.locator('[data-testid="preview-summary"]')).to_contain_text("1000 records")
        
        await page.click('[data-testid="start-migration-button"]')
        
        # Step 6: Verify Progress
        await expect(page.locator('[data-testid="migration-status"]')).to_have_text("InProgress")
        
        # Step 7: Wait for Completion
        await page.wait_for_selector(
            '[data-testid="migration-status"]',
            state="visible",
            timeout=300000
        )
        
        # Step 8: Verify Success
        await expect(page.locator('[data-testid="migration-status"]')).to_have_text("Completed")
        await expect(page.locator('[data-testid="records-processed"]')).to_have_text("1000")
        await expect(page.locator('[data-testid="errors-count"]')).to_have_text("0")
        
        # Step 9: Verify Data in Target
        await page.click('[data-testid="view-target-data-button"]')
        await expect(page.locator('[data-testid="record-count"]')).to_have_text("1000")

    async def test_migration_with_invalid_connection(self, page: Page, analyst_context):
        """Verify error handling for invalid source connection."""
        
        # Setup
        await page.goto("/login")
        await page.fill('[data-testid="email"]', analyst_context.email)
        await page.fill('[data-testid="password"]', analyst_context.password)
        await page.click('[data-testid="login-button"]')
        await page.wait_for_url("/dashboard")
        
        # Navigate and configure
        await page.click('[data-testid="nav-migrations"]')
        await page.click('[data-testid="create-migration-button"]')
        await page.fill('[data-testid="migration-name"]', "Invalid Connection Test")
        await page.select_option('[data-testid="source-type"]', "database")
        await page.fill('[data-testid="source-server"]', "INVALID-SERVER")
        await page.fill('[data-testid="source-database"]', "NonExistentDB")
        
        # Attempt to preview
        await page.click('[data-testid="preview-migration-button"]')
        
        # Verify error message
        await expect(page.locator('[data-testid="error-message"]')).to_contain_text(
            "Unable to connect to source database"
        )
        await expect(page.locator('[data-testid="start-migration-button"]')).to_be_disabled()
```

### 10.4 UAT Test Rules

| Rule | Description |
|------|-------------|
| UA-01 | UAT tests MUST be written in business-readable format |
| UA-02 | Each scenario MUST have clear preconditions and expected outcomes |
| UA-03 | UAT tests MUST be executable by non-technical stakeholders |
| UA-04 | Sign-off documentation MUST be completed before release |
| UA-05 | UAT defects MUST be tracked with business impact assessment |
| UA-06 | UAT environments MUST mirror production configuration |

---

## 11. Test Data — test-data/

### 11.1 Purpose

The `test-data/` directory contains all data fixtures, seed data, mocks, and snapshots used across the test suite.

### 11.2 Directory Layout

```
tests/test-data/
├── fixtures/
│   ├── migrations/
│   │   ├── small_migration.json
│   │   ├── large_migration.json
│   │   ├── failed_migration.json
│   │   └── in_progress_migration.json
│   ├── validations/
│   │   ├── valid_dataset.json
│   │   ├── invalid_dataset.json
│   │   └── mixed_dataset.json
│   ├── reports/
│   │   ├── executive_report.json
│   │   └── compliance_report.json
│   └── users/
│       ├── admin_user.json
│       ├── analyst_user.json
│       └── viewer_user.json
├── seed/
│   ├── database/
│   │   ├── seed_001_reference_data.sql
│   │   ├── seed_002_user_roles.sql
│   │   └── seed_003_test_migrations.sql
│   └── api/
│       ├── create_users.json
│       ├── create_migrations.json
│       └── create_validations.json
├── mocks/
│   ├── responses/
│   │   ├── azure_ad_token_response.json
│   │   ├── blob_storage_response.json
│   │   └── service_bus_response.json
│   └── services/
│       ├── mock_notification_service.py
│       └── mock_email_service.py
├── factories/
│   ├── user_factory.py
│   ├── migration_factory.py
│   ├── validation_factory.py
│   └── report_factory.py
└── snapshots/
    ├── expected/
    │   ├── migration_result_snapshot.json
    │   └── validation_result_snapshot.json
    └── actual/
        └── .gitkeep
```

### 11.3 Test Data Factory Example

```python
# tests/test-data/factories/migration_factory.py

from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4

from src.backend.api.models.migration import Migration, MigrationStatus


class MigrationFactory:
    """Factory for creating test Migration instances."""

    _counter = 0

    @classmethod
    def create(
        cls,
        id: Optional[str] = None,
        name: Optional[str] = None,
        status: MigrationStatus = MigrationStatus.Created,
        source: str = "test_source",
        target: str = "test_target",
        record_count: int = 100,
        **kwargs
    ) -> Migration:
        cls._counter += 1
        
        return Migration(
            id=id or str(uuid4()),
            name=name or f"Test Migration {cls._counter}",
            status=status,
            source=source,
            target=target,
            record_count=record_count,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
            **kwargs
        )

    @classmethod
    def create_completed(cls, **kwargs) -> Migration:
        return cls.create(
            status=MigrationStatus.Completed,
            **kwargs
        )

    @classmethod
    def create_in_progress(cls, **kwargs) -> Migration:
        return cls.create(
            status=MigrationStatus.InProgress,
            **kwargs
        )

    @classmethod
    def create_failed(cls, **kwargs) -> Migration:
        return cls.create(
            status=MigrationStatus.Failed,
            **kwargs
        )

    @classmethod
    def create_batch(cls, count: int, **kwargs) -> list[Migration]:
        return [cls.create(**kwargs) for _ in range(count)]

    @classmethod
    def reset_counter(cls):
        cls._counter = 0
```

### 11.4 Test Data Rules

| Rule | Description |
|------|-------------|
| TD-01 | Test data MUST be version-controlled in `test-data/` |
| TD-02 | Sensitive data MUST NOT be stored in test fixtures |
| TD-03 | Use factories for dynamic test data generation |
| TD-04 | Snapshot tests MUST store expected results in `snapshots/expected/` |
| TD-05 | Seed data MUST be idempotent (safe to run multiple times) |
| TD-06 | Clean up test data after test execution |

---

## 12. Test Reports — reports/

### 12.1 Purpose

The `reports/` directory stores generated test reports from various testing tools. This directory is gitignored except for baselines.

### 12.2 Directory Layout

```
tests/reports/
├── junit/
│   ├── unit_test_results.xml
│   ├── integration_test_results.xml
│   └── system_test_results.xml
├── coverage/
│   ├── coverage.xml
│   ├── htmlcov/
│   └── coverage.json
├── allure/
│   ├── results/
│   └── history/
├── performance/
│   ├── k6/
│   │   ├── load_test_summary.json
│   │   └── load_test_detailed.csv
│   └── jmeter/
│       ├── load_test_report.jtl
│       └── summary_report.html
├── security/
│   ├── bandit_report.json
│   ├── safety_report.json
│   └── zap_report.html
└── archived/
    └── {date}_{test_type}/
```

### 12.3 Report Naming Convention

```
{test_type}_{date}_{time}_{environment}.{extension}
```

Example: `unit_20260702_143000_staging.xml`

---

## 13. Automation Framework — automation/

### 13.1 Purpose

The `automation/` directory contains reusable automation code, page objects, step definitions, and framework configurations.

### 13.2 Directory Layout

```
tests/automation/
├── frameworks/
│   ├── playwright/
│   │   ├── playwright.config.ts
│   │   ├── fixtures/
│   │   │   ├── auth.setup.ts
│   │   │   └── database.setup.ts
│   │   └── global-setup.ts
│   ├── pytest/
│   │   ├── conftest.py
│   │   ├── pytest.ini
│   │   └── markers.py
│   └── k6/
│       ├── config.js
│       └── helpers.js
├── helpers/
│   ├── api/
│   │   ├── api_client.py
│   │   ├── migration_api.py
│   │   ├── validation_api.py
│   │   └── auth_api.py
│   ├── database/
│   │   ├── db_connection.py
│   │   ├── db_helpers.py
│   │   └── db_cleanup.py
│   └── utils/
│       ├── file_helpers.py
│       ├── date_helpers.py
│       └── assertion_helpers.py
├── pages/
│   ├── migration/
│   │   ├── migration_list_page.py
│   │   ├── migration_create_page.py
│   │   └── migration_detail_page.py
│   ├── validation/
│   │   ├── validation_list_page.py
│   │   └── validation_detail_page.py
│   ├── reporting/
│   │   ├── dashboard_page.py
│   │   └── report_viewer_page.py
│   └── admin/
│       ├── user_management_page.py
│       └── settings_page.py
├── step-definitions/
│   ├── migration_steps.py
│   ├── validation_steps.py
│   └── reporting_steps.py
└── runners/
    ├── parallel/
    │   ├── run_parallel.sh
    │   └── distribute_tests.py
    └── sequential/
        └── run_sequential.sh
```

### 13.3 Page Object Example

```python
# tests/automation/pages/migration/migration_create_page.py

from playwright.async_api import Page, expect


class MigrationCreatePage:
    """Page object for Migration Create page."""

    def __init__(self, page: Page):
        self.page = page
        self.url = "/migrations/create"

    # Locators
    @property
    def migration_name_input(self):
        return self.page.locator('[data-testid="migration-name"]')

    @property
    def source_type_select(self):
        return self.page.locator('[data-testid="source-type"]')

    @property
    def source_server_input(self):
        return self.page.locator('[data-testid="source-server"]')

    @property
    def source_database_input(self):
        return self.page.locator('[data-testid="source-database"]')

    @property
    def target_type_select(self):
        return self.page.locator('[data-testid="target-type"]')

    @property
    def target_server_input(self):
        return self.page.locator('[data-testid="target-server"]')

    @property
    def target_database_input(self):
        return self.page.locator('[data-testid="target-database"]')

    @property
    def preview_button(self):
        return self.page.locator('[data-testid="preview-migration-button"]')

    @property
    def start_button(self):
        return self.page.locator('[data-testid="start-migration-button"]')

    @property
    def error_message(self):
        return self.page.locator('[data-testid="error-message"]')

    # Actions
    async def navigate(self):
        await self.page.goto(self.url)
        await self.page.wait_for_load_state("networkidle")

    async def fill_source_config(
        self,
        server: str,
        database: str,
        source_type: str = "database"
    ):
        await self.source_type_select.select_option(source_type)
        await self.source_server_input.fill(server)
        await self.source_database_input.fill(database)

    async def fill_target_config(
        self,
        server: str,
        database: str,
        target_type: str = "database"
    ):
        await self.target_type_select.select_option(target_type)
        await self.target_server_input.fill(server)
        await self.target_database_input.fill(database)

    async def create_migration(
        self,
        name: str,
        source_server: str,
        source_database: str,
        target_server: str,
        target_database: str
    ):
        await self.migration_name_input.fill(name)
        await self.fill_source_config(source_server, source_database)
        await self.fill_target_config(target_server, target_database)
        await self.preview_button.click()

    async def start_migration(self):
        await self.start_button.click()

    # Assertions
    async def verify_error_message(self, expected_text: str):
        await expect(self.error_message).to_contain_text(expected_text)

    async def verify_start_button_disabled(self):
        await expect(self.start_button).to_be_disabled()
```

### 13.4 Automation Rules

| Rule | Description |
|------|-------------|
| AU-01 | Page objects MUST encapsulate page-specific locators and actions |
| AU-02 | Helper functions MUST be reusable across test suites |
| AU-03 | Use data-testid attributes for stable element selection |
| AU-04 | Framework configurations MUST be environment-aware |
| AU-05 | Automation code MUST follow the same coding standards as application code |
| AU-06 | Run automation tests in parallel when possible |

---

## 14. Test Fixtures — fixtures/

### 14.1 Purpose

The `fixtures/` directory contains pytest fixtures and factory classes shared across the entire test suite.

### 14.2 Directory Layout

```
tests/fixtures/
├── conftest/
│   ├── api_fixtures.py
│   ├── database_fixtures.py
│   ├── ai_fixtures.py
│   ├── authentication_fixtures.py
│   ├── file_fixtures.py
│   └── mock_fixtures.py
├── factories/
│   ├── user_factory.py
│   ├── migration_factory.py
│   ├── validation_factory.py
│   ├── report_factory.py
│   └── base_factory.py
└── seed/
    ├── seed_data.py
    ├── database_seeder.py
    └── cleanup.py
```

### 14.3 Fixture Example

```python
# tests/fixtures/conftest/database_fixtures.py

import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from src.backend.api.database import Base


@pytest_asyncio.fixture(scope="session")
async def engine():
    """Create test database engine."""
    engine = create_async_engine(
        "sqlite+aiosqlite:///./test.db",
        echo=False
    )
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    yield engine
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    await engine.dispose()


@pytest_asyncio.fixture
async def db_session(engine):
    """Create a database session for testing."""
    async_session = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with async_session() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture
async def db_session_with_data(db_session, sample_migration, sample_validation):
    """Create a database session with sample data."""
    db_session.add(sample_migration)
    db_session.add(sample_validation)
    await db_session.commit()
    
    return db_session
```

### 14.4 Fixture Rules

| Rule | Description |
|------|-------------|
| FX-01 | Fixtures MUST be defined in `fixtures/conftest/` |
| FX-02 | Use appropriate scope: `session`, `module`, `function` |
| FX-03 | Fixtures MUST clean up after themselves |
| FX-04 | Avoid fixture dependencies when possible |
| FX-05 | Document complex fixtures with docstrings |
| FX-06 | Use factories for dynamic test data |

---

## 15. Naming Conventions

### 15.1 File Naming

| Context | Convention | Example |
|---------|-----------|---------|
| Python test file | `test_{module}.py` | `test_migration_service.py` |
| TypeScript test file | `{Component}.test.tsx` | `MigrationDashboard.test.tsx` |
| Python fixture file | `{type}_fixtures.py` | `database_fixtures.py` |
| Factory file | `{entity}_factory.py` | `migration_factory.py` |
| Configuration file | `{tool}.ini` / `{tool}.config.ts` | `pytest.ini`, `playwright.config.ts` |
| Test data file | `{entity}_{scenario}.json` | `migration_completed.json` |
| Page object | `{page_name}_page.py` | `migration_create_page.py` |
| Step definition | `{feature}_steps.py` | `migration_steps.py` |

### 15.2 Folder Naming

| Context | Convention | Example |
|---------|-----------|---------|
| Test type | lowercase, singular | `unit`, `integration`, `system` |
| Feature area | lowercase, hyphen-separated | `migration-flows`, `validation-flows` |
| Test category | lowercase, hyphen-separated | `critical-paths`, `smoke` |
| Report type | lowercase, underscore-separated | `unit_test_results.xml` |

### 15.3 Test Case Naming

```
test_{action}_{subject}_{scenario}_{expected_result}
```

| Component | Description | Example |
|-----------|-------------|---------|
| `test_` | Prefix for all test methods | Required |
| `{action}` | What is being tested | `validate`, `create`, `get`, `update` |
| `{subject}` | The component under test | `migration`, `user`, `report` |
| `{scenario}` | The specific scenario | `not_found`, `invalid_input`, `concurrent` |
| `{expected_result}` | Expected outcome | `returns_error`, `creates_record`, `succeeds` |

Examples:

```python
def test_validate_migration_with_invalid_data_returns_error()
def test_create_migration_with_valid_data_succeeds()
def test_get_migration_when_not_found_raises_not_found_error()
def test_update_migration_status_concurrently_handles_race_condition()
```

### 15.4 Markers Convention

| Marker | Scope | Example |
|--------|-------|---------|
| `@pytest.mark.unit` | Unit tests | `@pytest.mark.unit` |
| `@pytest.mark.integration` | Integration tests | `@pytest.mark.integration` |
| `@pytest.mark.system` | System tests | `@pytest.mark.system` |
| `@pytest.mark.performance` | Performance tests | `@pytest.mark.performance` |
| `@pytest.mark.security` | Security tests | `@pytest.mark.security` |
| `@pytest.mark.uat` | UAT tests | `@pytest.mark.uat` |
| `@pytest.mark.smoke` | Smoke tests | `@pytest.mark.smoke` |
| `@pytest.mark.regression` | Regression tests | `@pytest.mark.regression` |
| `@pytest.mark.slow` | Long-running tests | `@pytest.mark.slow` |
| `@pytest.mark.e2e` | End-to-end tests | `@pytest.mark.e2e` |
| `@pytest.mark.scenario` | UAT scenarios | `@pytest.mark.scenario` |

---

## 16. File Organization Strategies

### 16.1 Strategy Comparison

| Strategy | Best For | Pros | Cons |
|----------|----------|------|------|
| **By Feature** | Large teams, microservices | Feature co-location, clear ownership | May duplicate utilities |
| **By Type** | Small teams, monoliths | Simple structure, easy to navigate | Feature scattered across dirs |
| **By Module** | Complex architectures | Module-level isolation | Requires careful planning |

### 16.2 Recommended: Hybrid Approach (By Feature + By Type)

MAP uses a **hybrid approach** combining feature-based and type-based organization:

```
tests/
├── unit/                    # By TYPE
│   ├── backend/             # By FEATURE area
│   │   ├── api/             # By MODULE
│   │   │   ├── controllers/
│   │   │   └── services/
│   │   └── workers/
│   └── frontend/            # By FEATURE area
│       ├── components/
│       └── hooks/
├── integration/             # By TYPE
│   ├── api/
│   └── services/
├── system/                  # By TYPE
│   ├── end-to-end/          # By FEATURE workflow
│   │   ├── migration-flows/
│   │   └── validation-flows/
│   └── regression/
```

### 16.3 When to Use Each Strategy

| Scenario | Recommended Strategy |
|----------|---------------------|
| Monorepo with multiple features | By Feature |
| Single-purpose application | By Type |
| Microservices architecture | By Module (service) |
| Mixed architecture | Hybrid |
| Small team (< 5 developers) | By Type |
| Large team (> 10 developers) | By Feature |

---

## 17. Configuration Files

### 17.1 pytest.ini

```ini
# configuration/pytest.ini

[pytest]
testpaths = tests/unit tests/integration tests/system
python_files = test_*.py
python_classes = Test*
python_functions = test_*

markers =
    unit: Unit tests (fast, isolated)
    integration: Integration tests (database, APIs)
    system: System tests (end-to-end workflows)
    performance: Performance tests (load, stress)
    security: Security tests (vulnerability, compliance)
    uat: User acceptance tests (business scenarios)
    smoke: Smoke tests (quick health checks)
    regression: Regression tests (full coverage)
    slow: Long-running tests (skip in CI)
    e2e: End-to-end tests (Playwright)
    scenario: UAT scenarios (business-readable)

addopts =
    --strict-markers
    --tb=short
    --cov=src
    --cov-report=html:tests/reports/coverage
    --cov-report=xml:tests/reports/coverage.xml
    --junitxml=tests/reports/junit/results.xml
    -v

filterwarnings =
    ignore::DeprecationWarning
    ignore::PendingDeprecationWarning

log_cli = true
log_cli_level = INFO
log_cli_format = %(asctime)s [%(levelname)8s] %(message)s (%(filename)s:%(lineno)s)
log_cli_date_format = %Y-%m-%d %H:%M:%S

log_file = tests/reports/pytest.log
log_file_level = DEBUG
log_file_format = %(asctime)s [%(levelname)8s] %(message)s (%(filename)s:%(lineno)s)
log_file_date_format = %Y-%m-%d %H:%M:%S
```

### 17.2 conftest.py (Root)

```python
# configuration/conftest.py

import pytest
import asyncio
from typing import AsyncGenerator


def pytest_configure(config):
    """Register custom markers."""
    config.addinivalue_line("markers", "unit: Unit tests")
    config.addinivalue_line("markers", "integration: Integration tests")
    config.addinivalue_line("markers", "system: System tests")
    config.addinivalue_line("markers", "performance: Performance tests")
    config.addinivalue_line("markers", "security: Security tests")
    config.addinivalue_line("markers", "uat: User acceptance tests")
    config.addinivalue_line("markers", "smoke: Smoke tests")
    config.addinivalue_line("markers", "regression: Regression tests")
    config.addinivalue_line("markers", "slow: Long-running tests")
    config.addinivalue_line("markers", "e2e: End-to-end tests")
    config.addinivalue_line("markers", "scenario: UAT scenarios")


@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(autouse=True)
def setup_test_environment():
    """Setup test environment before each test."""
    # Setup
    yield
    # Teardown


@pytest.fixture
def app_config():
    """Load test configuration."""
    return {
        "environment": "test",
        "database_url": "sqlite+aiosqlite:///./test.db",
        "api_base_url": "http://localhost:5000",
        "test_mode": True,
    }
```

### 17.3 Playwright Configuration

```typescript
// configuration/playwright.config.ts

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '../tests/system/end-to-end',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: '../tests/reports/playwright' }],
    ['junit', { outputFile: '../tests/reports/junit/playwright-results.xml' }],
    ['json', { outputFile: '../tests/reports/playwright-results.json' }],
  ],
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  outputDir: '../tests/reports/playwright-artifacts',
});
```

### 17.4 .env.test

```bash
# configuration/.env.test

# Environment
ENVIRONMENT=test
APP_NAME=MAP-Platform
APP_VERSION=1.0.0

# API
API_BASE_URL=http://localhost:5000
API_VERSION=v1

# Database
DATABASE_URL=sqlite+aiosqlite:///./test.db
DATABASE_ECHO=false

# Authentication
AUTH_PROVIDER=test
TEST_USER_EMAIL=testuser@map-platform.test
TEST_USER_PASSWORD=TestPassword123!
TEST_ADMIN_EMAIL=testadmin@map-platform.test
TEST_ADMIN_PASSWORD=AdminPassword123!

# External Services (Mocked)
AZURE_AD_CLIENT_ID=test-client-id
AZURE_AD_CLIENT_SECRET=test-client-secret
AZURE_AD_TENANT_ID=test-tenant-id

# Storage
BLOB_STORAGE_CONNECTION=DefaultEndpointsProtocol=https;AccountName=teststorage
BLOB_STORAGE_CONTAINER=test-containers

# Service Bus
SERVICE_BUS_CONNECTION=Endpoint=sb://test.servicebus.windows.net/
SERVICE_BUS_QUEUE=test-queue

# AI Services
AI_ENDPOINT=http://localhost:8000
AI_API_KEY=test-api-key

# Testing
TEST_TIMEOUT=30000
TEST_PARALLEL_WORKERS=4
TEST_HEADLESS=true
```

---

## 18. CI/CD Integration

### 18.1 Pipeline Configuration

```yaml
# .github/workflows/ci-unit-tests.yml

name: Unit Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        python-version: ['3.11', '3.12']
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
          cache: 'pip'
      
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install -r requirements-dev.txt
      
      - name: Run linting
        run: |
          flake8 src/ tests/unit/
          mypy src/ tests/unit/
          black --check src/ tests/unit/
      
      - name: Run unit tests
        run: |
          pytest tests/unit/ \
            -v \
            --tb=short \
            --cov=src \
            --cov-report=xml:coverage.xml \
            --cov-report=html:htmlcov \
            -m "unit" \
            --junitxml=junit-results.xml
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml
          flags: unit-tests
          name: unit-tests-${{ matrix.python-version }}
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results-unit-${{ matrix.python-version }}
          path: |
            junit-results.xml
            htmlcov/
          retention-days: 30
```

### 18.2 Integration Test Pipeline

```yaml
# .github/workflows/ci-integration-tests.yml

name: Integration Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  integration-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: map_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: 'pip'
      
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install -r requirements-dev.txt
      
      - name: Run database migrations
        run: |
          alembic upgrade head
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/map_test
      
      - name: Seed test data
        run: |
          python scripts/seed-test-data.py
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/map_test
      
      - name: Run integration tests
        run: |
          pytest tests/integration/ \
            -v \
            --tb=short \
            -m "integration" \
            --junitxml=junit-results.xml
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/map_test
          ENVIRONMENT: test
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results-integration
          path: junit-results.xml
          retention-days: 30
```

### 18.3 Performance Test Pipeline

```yaml
# .github/workflows/ci-performance-tests.yml

name: Performance Tests

on:
  schedule:
    - cron: '0 2 * * 1'  # Every Monday at 2 AM
  workflow_dispatch:
    inputs:
      duration:
        description: 'Test duration (e.g., 10m, 30m)'
        required: false
        default: '10m'
      users:
        description: 'Number of virtual users'
        required: false
        default: '50'

jobs:
  performance-tests:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up k6
        uses: grafana/k6-action@v0.3.1
        with:
          version: v0.47.0
      
      - name: Run load test
        run: |
          k6 run \
            --out json=results.json \
            --summary-export=summary.json \
            tests/performance/load/scripts/migration_load_test.js
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}
          TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
      
      - name: Generate report
        run: |
          python scripts/generate-performance-report.py \
            --input summary.json \
            --output tests/reports/performance/
      
      - name: Upload performance results
        uses: actions/upload-artifact@v4
        with:
          name: performance-results-${{ github.run_number }}
          path: |
            tests/reports/performance/
            summary.json
          retention-days: 90
      
      - name: Check performance thresholds
        run: |
          python scripts/check-performance-thresholds.py \
            --input summary.json \
            --thresholds tests/performance/load/configs/thresholds.json
```

### 18.4 CI/CD Pipeline Summary

| Pipeline | Trigger | Purpose | Duration |
|----------|---------|---------|----------|
| Unit Tests | Push, PR | Fast feedback on code changes | ~5 min |
| Integration Tests | Push, PR | Verify component interactions | ~15 min |
| System Tests | Nightly, Release | Full workflow validation | ~45 min |
| Performance Tests | Weekly, Manual | Load and stress testing | ~30 min |
| Security Tests | Weekly, Pre-release | Vulnerability scanning | ~20 min |
| UAT Tests | Pre-release | Business acceptance | ~60 min |

---

## 19. Best Practices

### 19.1 Maintainability

| Practice | Description | Example |
|----------|-------------|---------|
| DRY Principle | Don't Repeat Yourself — use fixtures and factories | `MigrationFactory.create()` instead of inline data |
| Single Responsibility | Each test should verify one behavior | `test_create_migration_succeeds()` not `test_migration_lifecycle()` |
| Explicit Dependencies | Declare all test dependencies | Use fixtures, not global state |
| Version Control | Track all test assets in Git | Including test data and configurations |
| Documentation | Document complex test setups | Use docstrings for test classes and methods |

### 19.2 Readability

| Practice | Description | Example |
|----------|-------------|---------|
| Clear Naming | Test names should describe expected behavior | `test_validate_migration_with_invalid_data_returns_error()` |
| AAA Pattern | Arrange-Act-Assert consistently | See unit test example above |
| Descriptive Comments | Explain complex test scenarios | Business context in UAT tests |
| Consistent Formatting | Follow PEP 8 / ESLint | Use black, flake8, prettier |
| Visual Separation | Separate test phases with blank lines | Arrange | Act | Assert |

### 19.3 Organization

| Practice | Description | Example |
|----------|-------------|---------|
| Feature Co-location | Keep related tests together | All migration tests in `migration/` |
| Type Separation | Separate test types clearly | `unit/`, `integration/`, `system/` |
| Shared Utilities | Centralize common code | `automation/helpers/`, `fixtures/` |
| Test Data Management | Version-control test data | `test-data/fixtures/` |
| Report Organization | Structured report storage | `reports/{tool}/{date}/` |

### 19.4 Performance

| Practice | Description | Example |
|----------|-------------|---------|
| Parallel Execution | Run tests in parallel when possible | `pytest-xdist`, Playwright parallel mode |
| Selective Testing | Run appropriate test suite for context | Unit tests on PR, full suite on main |
| Test Caching | Cache test results and dependencies | `pytest-cache`, GitHub Actions cache |
| Resource Cleanup | Clean up test resources promptly | Database transactions, file handles |
| Optimized Fixtures | Use appropriate fixture scope | `session` for expensive setup |

### 19.5 Reliability

| Practice | Description | Example |
|----------|-------------|---------|
| Deterministic Tests | Tests should produce same result every time | Avoid time-dependent assertions |
| Isolated Tests | Tests should not depend on each other | Independent test data per test |
| Retry Logic | Implement retry for flaky tests | `pytest-rerunfailures`, Playwright retries |
| Environment Parity | Test environments should match production | Docker containers for consistency |
| Mock External Services | Mock APIs and external dependencies | `unittest.mock`, `responses` library |

---

## 20. Dependencies

### 20.1 Batch 11 Repository Structure

This document extends the patterns established in **Batch 11 Repository Structure** (`02_Repository_Structure.md`):

| Aspect | Batch 11 Reference | QA Extension |
|--------|-------------------|--------------|
| Root Layout | `src/`, `tests/`, `docs/` | Expanded `tests/` with subdirectories |
| Naming Conventions | PascalCase for folders | Extended with test-specific patterns |
| `.github/` | Workflows, templates | Added test-specific workflow files |
| `configuration/` | App config | Added test tool configurations |
| `scripts/` | Utility scripts | Added test utility scripts |

### 20.2 Batch 11 Coding Standards

This document follows the coding standards established in **Batch 11 Coding Standards** (`04_Coding_Standards.md`):

| Standard | Batch 11 Reference | Application in QA |
|----------|-------------------|-------------------|
| Naming | `test_{module}.py` pattern | Test files follow Python naming |
| Formatting | PEP 8, black, flake8 | Test code uses same formatters |
| Type Hints | Consistent type annotations | Fixtures and factories typed |
| Documentation | Docstrings for public APIs | Test classes and methods documented |
| Error Handling | Fail fast, clear messages | Assertions with descriptive messages |

### 20.3 Cross-References

| Document | Reference | Usage |
|----------|-----------|-------|
| `01_Quality_Assurance_Strategy.md` | QA Strategy | Overall quality approach |
| `04_Unit_Testing_Standards.md` | Unit Test Standards | Unit test guidelines |
| `05_Integration_Testing_Standards.md` | Integration Standards | Integration test guidelines |
| `06_System_Testing_Framework.md` | System Test Framework | System test approach |
| `07_UAT_Framework.md` | UAT Framework | UAT test guidelines |
| `08_Test_Automation_Framework.md` | Automation Framework | Automation approach |
| `09_Performance_Testing.md` | Performance Testing | Performance test guidelines |
| `10_Security_Testing.md` | Security Testing | Security test guidelines |
| `16_Test_Data_Management.md` | Test Data Management | Test data practices |
| `21_Testing_Tools_Evaluation.md` | Tool Evaluation | Tool selection rationale |

---

## 21. Directory Tree Reference

### 21.1 Quick Reference (Compact)

```
qa-repository/
├── .github/workflows/          # CI/CD pipelines
├── tests/
│   ├── unit/                   # Isolated component tests
│   │   ├── backend/            # Backend unit tests
│   │   ├── frontend/           # Frontend unit tests
│   │   ├── ai/                 # AI component tests
│   │   └── shared/             # Shared utility tests
│   ├── integration/            # Component interaction tests
│   │   ├── api/                # API integration tests
│   │   ├── services/           # Service integration tests
│   │   ├── external/           # External service tests
│   │   └── ai/                 # AI integration tests
│   ├── system/                 # End-to-end workflow tests
│   │   ├── end-to-end/         # Full workflow tests
│   │   ├── regression/         # Regression test suite
│   │   └── acceptance/         # Acceptance criteria tests
│   ├── performance/            # Load, stress, endurance tests
│   │   ├── load/               # Load test scripts
│   │   ├── stress/             # Stress test scripts
│   │   ├── endurance/          # Endurance test scripts
│   │   └── spike/              # Spike test scripts
│   ├── security/               # Vulnerability & compliance tests
│   │   ├── vulnerability/      # SAST, DAST, SCA scans
│   │   ├── penetration/        # Penetration tests
│   │   ├── compliance/         # Regulatory compliance
│   │   └── authentication/     # Auth & RBAC tests
│   ├── uat/                    # User acceptance tests
│   │   ├── scenarios/          # Business scenarios
│   │   ├── test-cases/         # Manual & automated cases
│   │   ├── user-flows/         # User flow definitions
│   │   └── sign-off/           # Sign-off documentation
│   ├── test-data/              # Test data & fixtures
│   │   ├── fixtures/           # Static test data
│   │   ├── seed/               # Database seed scripts
│   │   ├── mocks/              # Mock responses & services
│   │   ├── factories/          # Data factory classes
│   │   └── snapshots/          # Expected/actual snapshots
│   ├── reports/                # Generated test reports
│   │   ├── junit/              # JUnit XML results
│   │   ├── coverage/           # Coverage reports
│   │   ├── allure/             # Allure reports
│   │   ├── performance/        # Performance test reports
│   │   ├── security/           # Security scan reports
│   │   └── archived/           # Historical reports
│   ├── automation/             # Reusable automation code
│   │   ├── frameworks/         # Framework configs
│   │   ├── helpers/            # Shared helper functions
│   │   ├── pages/              # Page objects
│   │   ├── step-definitions/   # Step definitions
│   │   └── runners/            # Test runners
│   └── fixtures/               # Pytest fixtures
│       ├── conftest/           # Shared fixtures
│       ├── factories/          # Factory classes
│       └── seed/               # Seed data helpers
├── configuration/              # Tool configurations
│   ├── pytest.ini              # Pytest configuration
│   ├── conftest.py             # Root conftest
│   ├── playwright.config.ts    # Playwright configuration
│   ├── .env.test               # Test environment variables
│   └── k6.config.js            # k6 configuration
├── scripts/                    # Utility scripts
├── docs/                       # Documentation
├── .gitignore                  # Git ignore rules
├── .editorconfig               # Editor configuration
├── README.md                   # Repository documentation
├── requirements.txt            # Python dependencies
└── package.json                # Node.js dependencies
```

### 21.2 File Count Summary

| Directory | Expected Files | Description |
|-----------|---------------|-------------|
| `tests/unit/` | 150-300 | Unit test files |
| `tests/integration/` | 50-100 | Integration test files |
| `tests/system/` | 30-60 | System test files |
| `tests/performance/` | 20-40 | Performance test scripts |
| `tests/security/` | 40-80 | Security test files |
| `tests/uat/` | 60-120 | UAT test files |
| `tests/test-data/` | 100-200 | Test data files |
| `tests/reports/` | Dynamic | Generated reports |
| `tests/automation/` | 80-150 | Automation framework |
| `tests/fixtures/` | 30-60 | Fixture files |
| `configuration/` | 10-15 | Config files |
| `scripts/` | 10-20 | Utility scripts |
| **Total** | **580-1145** | All test-related files |

---

## 22. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 02 July 2026 | MAP Quality Engineering Team | Initial document creation |
| | | | Defined complete QA repository structure |
| | | | Established naming conventions |
| | | | Documented CI/CD integration patterns |
| | | | Added best practices and guidelines |

---

## 23. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| MAP Quality Engineering Lead | _________________ | ____/____/________ | _________________ |
| MAP Platform Architect | _________________ | ____/____/________ | _________________ |
| MAP Engineering Manager | _________________ | ____/____/________ | _________________ |
| MAP Security Lead | _________________ | ____/____/________ | _________________ |
| MAP Release Manager | _________________ | ____/____/________ | _________________ |

---

**End of Document**

*Document ID: MAP-QA-REPO-STRUCTURE-001*
*Classification: Internal / Confidential*
*Retention: 7 years*
