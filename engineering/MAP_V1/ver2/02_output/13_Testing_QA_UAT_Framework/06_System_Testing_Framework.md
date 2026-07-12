# System Testing Framework — MAP (Migration Assurance Platform)

| Field        | Value                                      |
|--------------|--------------------------------------------|
| **Title**    | System Testing Framework for MAP           |
| **Version**  | 1.0                                        |
| **Date**     | July 2026                                  |
| **Status**   | Official                                   |
| **Author**   | MAP Engineering & Quality Assurance Team   |
| **Approver** | Head of Engineering / VP of Quality        |
| **Domain**   | Financial Services Migration Product       |
| **Classification** | Internal / Confidential              |
| **Review Cycle** | Quarterly                              |

---

## Table of Contents

1. [Purpose and Scope](#1-purpose-and-scope)
2. [Definitions and Acronyms](#2-definitions-and-acronyms)
3. [System Testing Strategy Overview](#3-system-testing-strategy-overview)
4. [End-to-End Testing Framework](#4-end-to-end-testing-framework)
5. [Business Process Validation](#5-business-process-validation)
6. [Workflow Validation](#6-workflow-validation)
7. [Configuration Testing](#7-configuration-testing)
8. [Environment Validation](#8-environment-validation)
9. [Test Scenario Design](#9-test-scenario-design)
10. [Test Data Requirements](#10-test-data-requirements)
11. [Environment Management](#11-environment-management)
12. [Recommended Tools and Frameworks](#12-recommended-tools-and-frameworks)
13. [Best Practices](#13-best-practices)
14. [Test Execution and Reporting](#14-test-execution-and-reporting)
15. [Traceability Matrix](#15-traceability-matrix)
16. [Dependencies](#16-dependencies)
17. [Revision History](#17-revision-history)
18. [Approval and Sign-Off](#18-approval-and-sign-off)
19. [Appendices](#19-appendices)

---

## 1. Purpose and Scope

### 1.1 Purpose

This document defines the system testing framework for the **Migration Assurance Platform (MAP)**. It establishes the standards, processes, tooling, and governance required to validate the complete MAP system end-to-end — from user interaction through service orchestration, data flow, configuration, and infrastructure health.

System testing is the highest level of technical testing before User Acceptance Testing (UAT). It exercises the fully integrated MAP system against its specification, verifying that all components — presentation layer, API gateway, application services, data layer, and external integrations — work together correctly to deliver the intended business outcomes.

This framework ensures that:

- Complete user journeys are validated from start to finish
- Cross-service flows are tested for correctness and resilience
- Business processes are verified against regulatory and operational requirements
- Workflow state machines operate correctly under all conditions
- Configuration and environment variables produce expected system behavior
- Infrastructure dependencies are healthy and properly integrated

### 1.2 Scope

This standard applies to all system test activities within the MAP product ecosystem:

| Area                          | Coverage                                                    |
|-------------------------------|-------------------------------------------------------------|
| End-to-End User Journeys     | Complete workflows from login through migration execution    |
| Cross-Service Flows           | Multi-service orchestration and data flow validation        |
| Business Process Validation   | Migration workflows, validation pipelines, approval flows   |
| Workflow State Machines       | State transitions, guards, error recovery, rollback         |
| Configuration Testing         | Environment configs, feature flags, runtime toggles         |
| Environment Validation        | Infrastructure health, service connectivity, dependency checks |
| Data Integrity                | End-to-end data consistency across all layers               |
| Non-Functional Integration    | Performance, security, accessibility at system level        |
| Regression                    | Full system regression after changes                        |

### 1.3 Out of Scope

- Unit testing (covered in `04_Unit_Testing_Standards.md`)
- Integration testing (covered in `05_Integration_Testing_Standards.md`)
- User Acceptance Testing (covered in `07_UAT_Framework.md`)
- Performance and load testing (covered in `08_Performance_Testing_Standards.md`)
- Security penetration testing (covered in `09_Security_Testing_Standards.md`)

### 1.4 Relationship to Other Test Levels

```
┌──────────────────────────────────────────────────────────────┐
│                    SYSTEM TESTING (This Document)             │
│            Validates complete integrated system behavior      │
├──────────────────────────────────────────────────────────────┤
│  Layer: UAT           │ Business validation, stakeholder sign-off │
│  Layer: System        │ ← THIS DOCUMENT                            │
│  Layer: Integration   │ Service boundaries, contracts, data flow    │
│  Layer: Unit          │ Individual functions, methods, classes      │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Definitions and Acronyms

| Term             | Definition                                                        |
|------------------|-------------------------------------------------------------------|
| MAP              | Migration Assurance Platform                                      |
| SUT              | System Under Test                                                 |
| E2E              | End-to-End                                                        |
| BDD              | Behavior-Driven Development                                       |
| Given-When-Then  | Structured test scenario format (Arrange-Act-Assert equivalent)   |
| CI/CD            | Continuous Integration / Continuous Deployment                    |
| API              | Application Programming Interface                                 |
| REST             | Representational State Transfer                                    |
| gRPC             | Google Remote Procedure Call                                      |
| JSON             | JavaScript Object Notation                                        |
| YAML             | YAML Ain't Markup Language                                        |
| OAuth 2.0        | Open Authorization version 2.0                                    |
| OIDC             | OpenID Connect                                                    |
| SSO              | Single Sign-On                                                    |
| SLA              | Service Level Agreement                                           |
| DUT              | Device Under Test                                                 |
| SUT              | System Under Test                                                 |
| FSM              | Finite State Machine                                              |
| CDC              | Change Data Capture                                               |
| ETL              | Extract, Transform, Load                                          |
| Fixture          | Predefined test data and state                                    |
| Scenario         | A high-level test case expressed in BDD syntax                    |
| Feature File     | A Gherkin-format file containing BDD scenarios                    |
| Harness          | Test execution infrastructure                                     |
| Mock             | Simulated component mimicking real behavior                       |
| Stub             | Simplified implementation returning predefined responses          |
| Contract         | Agreement between consumer and provider on API behavior           |
| Schema           | Structural definition of data payloads                            |

---

## 3. System Testing Strategy Overview

### 3.1 Testing Pyramid Position

System tests sit between integration tests and UAT in the MAP testing pyramid:

```
                    /\
                   / UAT \           < 5% of tests — business validation
                  /--------\
                 / SYSTEM   \        < 10% of tests — THIS DOCUMENT
                /--------------\
               / Integration    \    < 25% of tests — service-level flows
              /------------------\
             /    Unit Tests      \  60% of tests — pure logic, no I/O
            /----------------------\
```

### 3.2 System Test Classification

MAP classifies system tests into four tiers based on scope and business criticality:

| Tier     | Scope                                          | Typical Runtime | Business Impact |
|----------|------------------------------------------------|-----------------|-----------------|
| Tier 1   | Critical path migration workflows              | < 5 minutes     | Critical        |
| Tier 2   | Secondary user journeys and reporting flows    | < 10 minutes    | High            |
| Tier 3   | Configuration, edge cases, error recovery      | < 15 minutes    | Medium          |
| Tier 4   | Cross-system integration with external deps    | < 20 minutes    | Medium          |

### 3.3 System Test Lifecycle

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌────────────┐
│  Plan &     │────▶│  Design &    │────▶│  Execute &    │────▶│  Report &  │
│  Scoping    │     │  Implement   │     │  Validate     │     │  Sign-off  │
└─────────────┘     └──────────────┘     └───────────────┘     └────────────┘
       │                   │                    │                      │
  - Identify            - Write             - Run in              - Publish
    journeys              scenarios            staging               results
  - Prioritize          - Set up            - Capture             - File
    risks                 data                 evidence            defects
  - Define              - Configure         - Compare             - Obtain
    criteria              envs                 baselines           approval
```

### 3.4 Entry and Exit Criteria

#### 3.4.1 System Test Entry Criteria

| # | Criterion | Verification Method |
|---|-----------|---------------------|
| E1 | All integration tests passing | CI pipeline status |
| E2 | No open P1/P2 defects from integration testing | Defect management system |
| E3 | System test environment provisioned and validated | Environment health check |
| E4 | Test data loaded and verified | Data validation scripts |
| E5 | All dependent services operational | Service health dashboard |
| E6 | API contracts published and stable | Contract registry |
| E7 | System test plan approved | Approval record |

#### 3.4.2 System Test Exit Criteria

| # | Criterion | Verification Method |
|---|-----------|---------------------|
| X1 | 100% of Tier 1 scenarios pass | Test execution report |
| X2 | 95% of Tier 2 scenarios pass | Test execution report |
| X3 | 90% of Tier 3 scenarios pass | Test execution report |
| X4 | Zero open P1/P2 defects | Defect management system |
| X5 | All critical data integrity checks pass | Data validation report |
| X6 | Performance baselines met | Performance test report |
| X7 | Accessibility scan clean | Accessibility report |
| X8 | QA Lead sign-off obtained | Approval record |

---

## 4. End-to-End Testing Framework

### 4.1 End-to-End Testing Principles

End-to-end (E2E) testing validates complete user journeys across the entire MAP system, from the browser through the API gateway, application services, data layer, and external integrations. E2E tests simulate real user workflows to ensure the system delivers the expected business outcomes.

#### 4.1.1 E2E Testing Principles

| # | Principle | Description |
|---|-----------|-------------|
| E2E1 | Test complete user journeys | Every E2E test must exercise a full workflow, not isolated steps |
| E2E2 | Use production-like data | Test data must reflect real-world complexity and volume |
| E2E3 | Verify side effects | Check database state, messages, notifications, and external calls |
| E2E4 | Test across failure modes | Include timeout, retry, and partial failure scenarios |
| E2E5 | Minimize test count | E2E tests are expensive — favor fewer, comprehensive scenarios |
| E2E6 | Automate regression | All critical E2E paths must be automated in CI/CD |
| E2E7 | Maintain test independence | Each test must set up and tear down its own state |

### 4.2 Critical User Journeys

The following table defines the mandatory E2E test scenarios for MAP:

| Journey ID | Journey Name | Priority | Components Exposed | Automation |
|------------|--------------|----------|--------------------|------------|
| CJ-001 | User Login and Dashboard Load | Critical | Auth, API Gateway, Web App, Reporting Service | 100% |
| CJ-002 | Create Migration Project | Critical | Web App, API Gateway, Validation Service, Azure SQL | 100% |
| CJ-003 | Execute Full Migration Cycle | Critical | All application services, Data layer, Azure Resources | 100% |
| CJ-004 | View Migration Report | High | Reporting Service, Azure SQL, Web App | 100% |
| CJ-005 | Pause and Resume Migration | High | Migration Service, State Manager, Azure SQL | 100% |
| CJ-006 | Handle Migration Failure | High | Migration Service, Error Handler, Notification Service | 100% |
| CJ-007 | Generate Compliance Report | High | Reporting Service, AI Service, Blob Storage | 100% |
| CJ-008 | Admin User Management | Medium | Auth Service, Admin Portal, Azure SQL | 80% |
| CJ-009 | Configure Validation Rules | Medium | Validation Service, Azure SQL, Web App | 80% |
| CJ-010 | Export Migration Data | Medium | Reporting Service, Blob Storage, Web App | 80% |

### 4.3 E2E Journey: Complete Migration Cycle (CJ-003)

This section provides a detailed E2E test scenario for the most critical MAP workflow.

#### 4.3.1 Journey Map

```
User                   Web App              API Gateway         Validation Service
 │                       │                     │                      │
 ├── 1. Login ──────────▶│                     │                      │
 │                       ├── 2. Auth Request ──▶│                      │
 │                       │                     ├── 3. Token Issued ──▶│
 │◀── 4. Dashboard ──────┤                     │                      │
 │                       │                     │                      │
 ├── 5. Create ─────────▶│                     │                      │
 │   Migration           ├── 6. POST /migrations ▶│                   │
 │                       │                     ├── 7. Validate Input ─▶│
 │                       │                     │                      ├── 8. Schema Check
 │                       │                     │                      ├── 9. Business Rules
 │                       │                     │                      ├── 10. Write to DB
 │◀── 11. Migration ─────┤◀────────────────────┤◀─────────────────────┤
 │    Created            │                     │                      │
 │                       │                     │                      │
 ├── 12. Start ─────────▶│                     │                      │
 │    Migration          ├── 13. PATCH /migrations/{id}/start ▶│      │
 │                       │                     ├── 14. Start ─────────▶│
 │                       │                     │                      ├── 15. Read Source
 │                       │                     │                      ├── 16. Transform
 │                       │                     │                      ├── 17. Write Target
 │                       │                     │                      ├── 18. Validate
 │                       │                     │                      ├── 19. Update Progress
 │◀── 20. Status ────────┤◀────────────────────┤◀─────────────────────┤
 │    Updated            │                     │                      │
 │                       │                     │                      │
 ├── 21. View ──────────▶│                     │                      │
 │    Results            ├── 22. GET /migrations/{id}/results ▶│      │
 │                       │                     ├── 23. Query ─────────▶│
 │◀── 24. Report ────────┤◀────────────────────┤◀─────────────────────┤
 │    Displayed          │                     │                      │
```

#### 4.3.2 BDD Scenario: Complete Migration

```gherkin
Feature: Complete Migration Cycle
  As a Migration Engineer
  I want to execute a full data migration from source to target
  So that I can validate data integrity across systems

  Background:
    Given the MAP platform is deployed and healthy
    And the following user accounts exist:
      | username          | role     | status |
      | migration.admin   | ADMIN    | ACTIVE |
      | migration.eng01   | ENGINEER | ACTIVE |
    And the source system "CORE_BANKING" contains 1000 account records
    And the target system "CLOUD_MIGRATION" is accessible

  @critical @smoke @e2e
  Scenario: Successfully migrate accounts from source to target
    Given I am logged in as "migration.eng01"
    And I am on the Dashboard page

    When I navigate to "New Migration" form
    And I select source system "CORE_BANKING"
    And I select target system "CLOUD_MIGRATION"
    And I select record type "ACCOUNTS"
    And I configure batch size to 500
    And I submit the migration request

    Then I should see a success notification
    And a migration project should be created with status "PENDING"
    And the migration should appear in my project list

    When I start the migration project
    Then the migration status should change to "RUNNING"
    And I should see real-time progress updates

    When the migration completes
    Then the migration status should change to "COMPLETED"
    And 1000 records should be processed
    And 0 records should have errors
    And the validation results should show 100% pass rate

    When I navigate to the migration report
    Then I should see a summary of the migration
    And I should see data integrity validation results
    And I should be able to export the report as PDF

  @critical @e2e
  Scenario: Handle partial migration failure with retry
    Given I am logged in as "migration.eng01"
    And I have a migration project with status "RUNNING"

    When the migration encounters a transient error
    Then the migration status should change to "PAUSED"
    And I should see an error notification with failure details
    And the partially processed records should be preserved

    When I retry the migration
    Then the migration status should change to "RUNNING"
    And processing should resume from the last successful record
    And the migration should complete successfully

  @high @e2e
  Scenario: Validate data integrity after migration
    Given I am logged in as "migration.eng01"
    And a migration has been completed successfully

    When I run data integrity validation
    Then all source records should be present in target
    And no duplicate records should exist
    And all field mappings should be correct
    And audit trail should be complete
    And validation results should be stored
```

### 4.4 Cross-Service Flow Testing

Cross-service flows validate that multiple MAP microservices collaborate correctly to deliver business outcomes.

#### 4.4.1 Cross-Service Flow Matrix

| Flow ID | Flow Name | Services Involved | Protocol | Priority |
|---------|-----------|-------------------|----------|----------|
| CS-001 | Migration Creation | API Gateway → Validation Service → Azure SQL | REST + SQL | Critical |
| CS-002 | Migration Execution | Validation Service → Azure Resources → Notification Service | REST + Event | Critical |
| CS-003 | Validation Pipeline | Validation Service → AI Service → Reporting Service | REST + gRPC | Critical |
| CS-004 | Authentication Flow | Auth Service → API Gateway → All Services | OAuth 2.0 | Critical |
| CS-005 | Notification Delivery | Event Bus → Notification Service → Email/Teams | Event + REST | High |
| CS-006 | Audit Trail | All Services → Event Bus → Audit Service | Event + SQL | High |
| CS-007 | Report Generation | Reporting Service → Azure SQL → Blob Storage → Web App | REST + SQL | Medium |
| CS-008 | Admin Configuration | Admin Portal → API Gateway → Auth Service → Azure SQL | REST + SQL | Medium |

#### 4.4.2 Cross-Service Test Example (Playwright)

```python
# tests/system/test_cross_service_migration_flow.py

import pytest
from playwright.sync_api import Page, expect
import requests
import time


class TestMigrationCreationFlow:
    """Cross-service flow: Migration creation across API Gateway, Validation Service, and Database."""

    BASE_URL = "http://localhost:3000"
    API_URL = "http://localhost:8080"

    @pytest.fixture(autouse=True)
    def setup(self, page: Page):
        self.page = page
        self.page.goto(self.BASE_URL)
        # Login
        self.page.fill('[data-testid="username"]', "migration.eng01")
        self.page.fill('[data-testid="password"]', "{{TEST_PASSWORD}}")
        self.page.click('[data-testid="login-button"]')
        expect(self.page.locator('[data-testid="dashboard"]')).to_be_visible()

    def test_create_migration_full_flow(self):
        """Verify migration creation flows through all services correctly."""
        # Step 1: Navigate to create migration
        self.page.click('[data-testid="new-migration-button"]')
        expect(self.page.locator('[data-testid="migration-form"]')).to_be_visible()

        # Step 2: Fill in migration details
        self.page.select_option('[data-testid="source-system"]', "CORE_BANKING")
        self.page.select_option('[data-testid="target-system"]', "CLOUD_MIGRATION")
        self.page.select_option('[data-testid="record-type"]', "ACCOUNTS")
        self.page.fill('[data-testid="batch-size"]', "500")

        # Step 3: Submit and verify API call
        with self.page.expect_response(
            lambda resp: "/api/v1/migrations" in resp.url and resp.status == 201
        ) as response_info:
            self.page.click('[data-testid="submit-migration"]')

        response = response_info.value
        migration_data = response.json()
        migration_id = migration_data["migrationId"]

        # Step 4: Verify success notification
        expect(self.page.locator('[data-testid="success-toast"]')).to_be_visible()

        # Step 5: Verify migration appears in list
        self.page.click('[data-testid="projects-link"]')
        expect(
            self.page.locator(f'[data-testid="migration-{migration_id}"]')
        ).to_be_visible()

        # Step 6: Verify database state via API
        api_response = requests.get(
            f"{self.API_URL}/api/v1/migrations/{migration_id}",
            headers={"Authorization": "Bearer {{TEST_TOKEN}}"}
        )
        assert api_response.status_code == 200
        assert api_response.json()["status"] == "PENDING"
        assert api_response.json()["sourceSystem"] == "CORE_BANKING"
        assert api_response.json()["targetSystem"] == "CLOUD_MIGRATION"
```

#### 4.4.3 Cross-Service Test Example (pytest + requests)

```python
# tests/system/test_cross_service_notification_flow.py

import pytest
import requests
import time
import uuid


class TestNotificationFlow:
    """Cross-service flow: Migration event triggers notification delivery."""

    SERVICES = {
        "api_gateway": "http://localhost:8080",
        "notification": "http://localhost:8082",
    }

    TIMEOUT = 10.0

    def test_migration_completion_triggers_notification(self):
        """Verify migration completion event triggers notification service."""
        # Create and complete a migration
        migration_id = self._create_test_migration()
        self._start_migration(migration_id)
        self._wait_for_migration_completion(migration_id, timeout=300)

        # Verify notification was created
        time.sleep(5)  # Allow event propagation
        notifications = self._get_notifications_for_migration(migration_id)

        assert len(notifications) >= 1
        notification = notifications[0]
        assert notification["type"] == "MIGRATION_COMPLETED"
        assert notification["migrationId"] == migration_id
        assert notification["status"] == "SENT"

    def test_migration_failure_triggers_alert_notification(self):
        """Verify migration failure triggers alert notification to admin."""
        migration_id = self._create_test_migration_with_invalid_data()
        self._start_migration(migration_id)
        self._wait_for_migration_failure(migration_id, timeout=120)

        time.sleep(5)
        notifications = self._get_notifications_for_migration(migration_id)

        alert_notifications = [n for n in notifications if n["priority"] == "HIGH"]
        assert len(alert_notifications) >= 1
        assert alert_notifications[0]["recipients"] == ["admin@map.local"]

    def _create_test_migration(self) -> str:
        response = requests.post(
            f"{self.SERVICES['api_gateway']}/api/v1/migrations",
            json={
                "sourceSystem": "CORE_BANKING",
                "targetSystem": "CLOUD_MIGRATION",
                "recordType": "ACCOUNTS",
                "batchSize": 100
            },
            headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
            timeout=self.TIMEOUT
        )
        assert response.status_code == 201
        return response.json()["migrationId"]

    def _start_migration(self, migration_id: str):
        response = requests.patch(
            f"{self.SERVICES['api_gateway']}/api/v1/migrations/{migration_id}",
            json={"action": "start"},
            headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
            timeout=self.TIMEOUT
        )
        assert response.status_code == 200

    def _wait_for_migration_completion(self, migration_id: str, timeout: int):
        start = time.time()
        while time.time() - start < timeout:
            response = requests.get(
                f"{self.SERVICES['api_gateway']}/api/v1/migrations/{migration_id}",
                headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
                timeout=self.TIMEOUT
            )
            status = response.json()["status"]
            if status == "COMPLETED":
                return
            if status == "FAILED":
                pytest.fail(f"Migration failed: {response.json().get('error')}")
            time.sleep(5)
        pytest.fail(f"Migration did not complete within {timeout}s")

    def _wait_for_migration_failure(self, migration_id: str, timeout: int):
        start = time.time()
        while time.time() - start < timeout:
            response = requests.get(
                f"{self.SERVICES['api_gateway']}/api/v1/migrations/{migration_id}",
                headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
                timeout=self.TIMEOUT
            )
            if response.json()["status"] == "FAILED":
                return
            time.sleep(5)
        pytest.fail(f"Migration did not fail within {timeout}s")

    def _get_notifications_for_migration(self, migration_id: str) -> list:
        response = requests.get(
            f"{self.SERVICES['notification']}/api/v1/notifications",
            params={"migrationId": migration_id},
            headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
            timeout=self.TIMEOUT
        )
        assert response.status_code == 200
        return response.json().get("data", [])
```

---

## 5. Business Process Validation

### 5.1 Migration Workflow Validation

Business process validation ensures that MAP migration workflows operate correctly according to business rules, regulatory requirements, and operational standards.

#### 5.1.1 Migration Lifecycle States

```
                    ┌─────────┐
                    │ CREATED │
                    └────┬────┘
                         │
                         ▼
                    ┌─────────┐
            ┌──────│ PENDING │──────┐
            │      └────┬────┘      │
            │           │            │
            ▼           ▼            ▼
       ┌─────────┐ ┌─────────┐ ┌───────────┐
       │PAUSED   │ │RUNNING  │ │CANCELLED  │
       └────┬────┘ └────┬────┘ └───────────┘
            │           │
            │           ├──▶ ┌───────────┐
            │           │    │ FAILED    │──▶ (retry) ──▶ RUNNING
            │           │    └───────────┘
            │           │
            │           ▼
            │      ┌───────────┐
            └─────▶│ COMPLETED │
                   └───────────┘
```

#### 5.1.2 Migration Workflow Test Scenarios

| Scenario ID | Scenario | Precondition | Action | Expected Result |
|-------------|----------|--------------|--------|-----------------|
| MW-001 | Create migration with valid data | User authenticated | Submit valid migration form | Migration created with status PENDING |
| MW-002 | Create migration with invalid data | User authenticated | Submit form with missing required fields | Validation error displayed, no migration created |
| MW-003 | Start migration from PENDING | Migration in PENDING state | Click Start | Status changes to RUNNING |
| MW-004 | Start migration from non-PENDING | Migration in COMPLETED state | Attempt start | Error: invalid state transition |
| MW-005 | Pause running migration | Migration in RUNNING state | Click Pause | Status changes to PAUSED |
| MW-006 | Resume paused migration | Migration in PAUSED state | Click Resume | Status changes to RUNNING |
| MW-007 | Complete migration successfully | Migration in RUNNING state, all records processed | Auto-transition | Status changes to COMPLETED |
| MW-008 | Fail migration on error | Migration in RUNNING state, unrecoverable error | Auto-transition | Status changes to FAILED |
| MW-009 | Retry failed migration | Migration in FAILED state | Click Retry | Status changes to RUNNING |
| MW-010 | Cancel pending migration | Migration in PENDING state | Click Cancel | Status changes to CANCELLED |
| MW-011 | Cancel running migration | Migration in RUNNING state | Click Cancel | Confirmation dialog, then CANCELLED |
| MW-012 | Prevent invalid state transition | Migration in COMPLETED state | Attempt to set PENDING | Error response 422 |

#### 5.1.3 Business Process Test Example

```python
# tests/system/test_migration_workflow.py

import pytest
import requests
import time


class TestMigrationWorkflow:
    """Validate migration workflow state machine and business rules."""

    BASE_URL = "http://localhost:8080/api/v1"
    HEADERS = {"Authorization": "Bearer {{TEST_TOKEN}}"}

    VALID_TRANSITIONS = {
        "PENDING": ["RUNNING", "CANCELLED"],
        "RUNNING": ["PAUSED", "COMPLETED", "FAILED", "CANCELLED"],
        "PAUSED": ["RUNNING", "CANCELLED"],
        "COMPLETED": [],
        "FAILED": ["RUNNING"],
        "CANCELLED": [],
    }

    @pytest.fixture
    def migration_id(self):
        """Create a fresh migration for each test."""
        response = requests.post(
            f"{self.BASE_URL}/migrations",
            json={
                "sourceSystem": "CORE_BANKING",
                "targetSystem": "CLOUD_MIGRATION",
                "recordType": "ACCOUNTS",
                "batchSize": 100
            },
            headers=self.HEADERS
        )
        assert response.status_code == 201
        return response.json()["migrationId"]

    def test_full_migration_lifecycle(self, migration_id):
        """MW-001 + MW-003 + MW-007: Complete lifecycle from creation to completion."""
        # Verify initial state
        response = requests.get(
            f"{self.BASE_URL}/migrations/{migration_id}",
            headers=self.HEADERS
        )
        assert response.json()["status"] == "PENDING"

        # Start migration
        response = requests.patch(
            f"{self.BASE_URL}/migrations/{migration_id}",
            json={"action": "start"},
            headers=self.HEADERS
        )
        assert response.status_code == 200
        assert response.json()["status"] == "RUNNING"

        # Wait for completion (in real test, this would be faster)
        self._wait_for_status(migration_id, "COMPLETED", timeout=300)

        # Verify final state
        response = requests.get(
            f"{self.BASE_URL}/migrations/{migration_id}",
            headers=self.HEADERS
        )
        assert response.json()["status"] == "COMPLETED"
        assert response.json()["recordsProcessed"] > 0

    def test_invalid_state_transition_rejected(self, migration_id):
        """MW-004: Attempting invalid state transition returns error."""
        # Migration is in PENDING state, try to move to COMPLETED directly
        response = requests.patch(
            f"{self.BASE_URL}/migrations/{migration_id}",
            json={"status": "COMPLETED"},
            headers=self.HEADERS
        )
        assert response.status_code == 422
        assert "INVALID_TRANSITION" in response.json()["error"]["code"]

    @pytest.mark.parametrize("from_state,to_state", [
        ("PENDING", "RUNNING"),
        ("RUNNING", "PAUSED"),
        ("RUNNING", "CANCELLED"),
        ("PAUSED", "RUNNING"),
        ("FAILED", "RUNNING"),
    ])
    def test_valid_state_transitions(self, from_state, to_state, migration_id):
        """Verify all valid state transitions are allowed."""
        # Setup: Move migration to from_state
        self._move_to_state(migration_id, from_state)

        # Attempt transition
        response = requests.patch(
            f"{self.BASE_URL}/migrations/{migration_id}",
            json={"status": to_state},
            headers=self.HEADERS
        )
        assert response.status_code == 200
        assert response.json()["status"] == to_state

    @pytest.mark.parametrize("from_state,to_state", [
        ("PENDING", "COMPLETED"),
        ("PENDING", "FAILED"),
        ("COMPLETED", "RUNNING"),
        ("COMPLETED", "PENDING"),
        ("CANCELLED", "RUNNING"),
        ("CANCELLED", "PENDING"),
    ])
    def test_invalid_state_transitions_rejected(self, from_state, to_state, migration_id):
        """Verify all invalid state transitions are rejected."""
        self._move_to_state(migration_id, from_state)

        response = requests.patch(
            f"{self.BASE_URL}/migrations/{migration_id}",
            json={"status": to_state},
            headers=self.HEADERS
        )
        assert response.status_code == 422

    def _move_to_state(self, migration_id: str, target_state: str):
        """Helper to move a migration to the required state for testing."""
        path = {
            "PENDING": [],
            "RUNNING": [("start", {})],
            "PAUSED": [("start", {}), ("pause", {})],
            "COMPLETED": [("start", {})],  # Assume auto-complete for test
            "FAILED": [("start", {})],  # Assume trigger failure for test
            "CANCELLED": [("cancel", {})],
        }
        for action, params in path.get(target_state, []):
            requests.patch(
                f"{self.BASE_URL}/migrations/{migration_id}",
                json={"action": action, **params},
                headers=self.HEADERS,
                timeout=30
            )
            time.sleep(1)

    def _wait_for_status(self, migration_id: str, target_status: str, timeout: int):
        """Poll migration status until target is reached."""
        start = time.time()
        while time.time() - start < timeout:
            response = requests.get(
                f"{self.BASE_URL}/migrations/{migration_id}",
                headers=self.HEADERS
            )
            current_status = response.json()["status"]
            if current_status == target_status:
                return
            if current_status in ["FAILED", "CANCELLED"]:
                pytest.fail(f"Migration entered terminal state: {current_status}")
            time.sleep(5)
        pytest.fail(f"Migration did not reach {target_status} within {timeout}s")
```

### 5.2 Validation Process Testing

#### 5.2.1 Validation Pipeline Stages

| Stage | Input | Output | Validation Rules |
|-------|-------|--------|-----------------|
| Schema Validation | Raw record | Schema-compliant record | Required fields, data types, formats |
| Business Rule Validation | Schema-compliant record | Rule-valid record | Domain constraints, referential integrity |
| Data Quality Validation | Rule-valid record | Quality-scored record | Completeness, accuracy, consistency |
| Cross-System Validation | Quality-scored record | Cross-validated record | Source-target mapping accuracy |
| Compliance Validation | Cross-validated record | Compliance-verified record | Regulatory requirements |

#### 5.2.2 Validation Process Test Example

```python
# tests/system/test_validation_pipeline.py

import pytest
import requests


class TestValidationPipeline:
    """Validate the complete validation pipeline from raw data to compliance check."""

    BASE_URL = "http://localhost:8080/api/v1"
    VALIDATION_URL = "http://localhost:8081/api/v1"
    HEADERS = {"Authorization": "Bearer {{TEST_TOKEN}}"}

    def test_validation_pipeline_processes_all_stages(self):
        """Verify a record passes through all validation stages."""
        migration_id = self._create_migration_with_sample_data()
        record_id = self._get_first_record_id(migration_id)

        # Trigger validation
        response = requests.post(
            f"{self.VALATION_URL}/validate",
            json={"migrationId": migration_id, "recordId": record_id},
            headers=self.HEADERS
        )
        assert response.status_code == 202

        # Wait for validation to complete
        validation_result = self._wait_for_validation(record_id, timeout=60)

        # Verify all stages passed
        assert validation_result["schemaValidation"]["status"] == "PASSED"
        assert validation_result["businessRuleValidation"]["status"] == "PASSED"
        assert validation_result["dataQualityValidation"]["status"] == "PASSED"
        assert validation_result["crossSystemValidation"]["status"] == "PASSED"
        assert validation_result["complianceValidation"]["status"] == "PASSED"

    def test_validation_catches_schema_violation(self):
        """Verify schema validation catches invalid data structures."""
        migration_id = self._create_migration_with_invalid_data()
        record_id = self._get_first_record_id(migration_id)

        response = requests.post(
            f"{self.VALIDATION_URL}/validate",
            json={"migrationId": migration_id, "recordId": record_id},
            headers=self.HEADERS
        )
        assert response.status_code == 202

        validation_result = self._wait_for_validation(record_id, timeout=60)

        assert validation_result["schemaValidation"]["status"] == "FAILED"
        assert len(validation_result["schemaValidation"]["errors"]) > 0
        assert validation_result["overallStatus"] == "FAILED"

    def test_validation_catches_business_rule_violation(self):
        """Verify business rule validation catches domain constraint violations."""
        migration_id = self._create_migration_with_business_rule_violation()
        record_id = self._get_first_record_id(migration_id)

        response = requests.post(
            f"{self.VALIDATION_URL}/validate",
            json={"migrationId": migration_id, "recordId": record_id},
            headers=self.HEADERS
        )
        assert response.status_code == 202

        validation_result = self._wait_for_validation(record_id, timeout=60)

        assert validation_result["schemaValidation"]["status"] == "PASSED"
        assert validation_result["businessRuleValidation"]["status"] == "FAILED"

    def test_validation_produces_complete_audit_trail(self):
        """Verify validation creates a complete audit trail for each stage."""
        migration_id = self._create_migration_with_sample_data()
        record_id = self._get_first_record_id(migration_id)

        requests.post(
            f"{self.VALIDATION_URL}/validate",
            json={"migrationId": migration_id, "recordId": record_id},
            headers=self.HEADERS
        )

        self._wait_for_validation(record_id, timeout=60)

        # Retrieve audit trail
        response = requests.get(
            f"{self.VALIDATION_URL}/records/{record_id}/audit",
            headers=self.HEADERS
        )
        assert response.status_code == 200

        audit_entries = response.json()["entries"]
        stages_audited = [e["stage"] for e in audit_entries]
        assert "SCHEMA_VALIDATION" in stages_audited
        assert "BUSINESS_RULE_VALIDATION" in stages_audited
        assert "DATA_QUALITY_VALIDATION" in stages_audited

    def _create_migration_with_sample_data(self) -> str:
        response = requests.post(
            f"{self.BASE_URL}/migrations",
            json={
                "sourceSystem": "CORE_BANKING",
                "targetSystem": "CLOUD_MIGRATION",
                "recordType": "ACCOUNTS",
                "batchSize": 10,
                "testMode": True
            },
            headers=self.HEADERS
        )
        return response.json()["migrationId"]

    def _get_first_record_id(self, migration_id: str) -> str:
        response = requests.get(
            f"{self.BASE_URL}/migrations/{migration_id}/records",
            headers=self.HEADERS
        )
        return response.json()["data"][0]["recordId"]

    def _wait_for_validation(self, record_id: str, timeout: int) -> dict:
        import time
        start = time.time()
        while time.time() - start < timeout:
            response = requests.get(
                f"{self.VALIDATION_URL}/records/{record_id}/validation",
                headers=self.HEADERS
            )
            result = response.json()
            if result["overallStatus"] in ["PASSED", "FAILED"]:
                return result
            time.sleep(2)
        pytest.fail(f"Validation did not complete within {timeout}s")
```

---

## 6. Workflow Validation

### 6.1 State Machine Testing

MAP uses finite state machines (FSMs) to manage migration lifecycle, validation pipeline progression, and notification delivery. State machine testing ensures that all transitions, guards, and error recovery mechanisms work correctly.

#### 6.1.1 State Machine Testing Principles

| # | Principle | Description |
|---|-----------|-------------|
| SM1 | Test all valid transitions | Every allowed state change must have a test |
| SM2 | Test all invalid transitions | Every disallowed state change must be rejected |
| SM3 | Test guard conditions | Every conditional transition must be validated |
| SM4 | Test entry/exit actions | State-specific actions must be verified |
| SM5 | Test error recovery | Failed transitions must leave state unchanged |
| SM6 | Test concurrency | Parallel state changes must not corrupt state |

#### 6.1.2 Migration State Machine Definition

```python
# src/migration_engine/state_machine.py

from enum import Enum
from typing import Dict, List, Tuple


class MigrationState(Enum):
    CREATED = "CREATED"
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    PAUSED = "PAUSED"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


# Valid transitions: (from_state, to_state) -> guard_condition
VALID_TRANSITIONS: Dict[Tuple[MigrationState, MigrationState], str] = {
    (MigrationState.CREATED, MigrationState.PENDING): "auto",
    (MigrationState.PENDING, MigrationState.RUNNING): "user_initiated",
    (MigrationState.PENDING, MigrationState.CANCELLED): "user_initiated",
    (MigrationState.RUNNING, MigrationState.PAUSED): "user_initiated",
    (MigrationState.RUNNING, MigrationState.COMPLETED): "all_records_processed",
    (MigrationState.RUNNING, MigrationState.FAILED): "unrecoverable_error",
    (MigrationState.RUNNING, MigrationState.CANCELLED): "user_initiated",
    (MigrationState.PAUSED, MigrationState.RUNNING): "user_initiated",
    (MigrationState.PAUSED, MigrationState.CANCELLED): "user_initiated",
    (MigrationState.FAILED, MigrationState.RUNNING): "user_initiated",
}
```

#### 6.1.3 State Machine Test Example

```python
# tests/system/test_state_machine.py

import pytest
from migration_engine.state_machine import MigrationState, VALID_TRANSITIONS


class TestMigrationStateMachine:
    """Validate migration state machine transitions and guards."""

    ALL_STATES = list(MigrationState)

    def test_all_valid_transitions_are_allowed(self):
        """Verify every defined valid transition can be executed."""
        for (from_state, to_state), guard in VALID_TRANSITIONS.items():
            machine = self._create_machine_in_state(from_state)
            result = machine.transition(to_state, context={"guard": guard})
            assert result.success, (
                f"Transition {from_state.value} -> {to_state.value} failed: {result.error}"
            )
            assert machine.current_state == to_state

    def test_all_invalid_transitions_are_rejected(self):
        """Verify every undefined transition is rejected."""
        for from_state in self.ALL_STATES:
            for to_state in self.ALL_STATES:
                if (from_state, to_state) not in VALID_TRANSITIONS:
                    machine = self._create_machine_in_state(from_state)
                    result = machine.transition(to_state)
                    assert not result.success, (
                        f"Transition {from_state.value} -> {to_state.value} "
                        f"should have been rejected"
                    )
                    assert machine.current_state == from_state

    def test_transition_preserves_state_on_failure(self):
        """Verify failed transition leaves state unchanged."""
        machine = self._create_machine_in_state(MigrationState.RUNNING)

        # Try invalid transition
        result = machine.transition(MigrationState.PENDING)
        assert not result.success
        assert machine.current_state == MigrationState.RUNNING

    def test_entry_action_executed_on_transition(self):
        """Verify entry actions run when entering a state."""
        machine = self._create_machine_in_state(MigrationState.PENDING)

        # Transition to RUNNING triggers entry action
        machine.transition(MigrationState.RUNNING, context={"guard": "user_initiated"})

        assert machine.entry_actions_executed == ["start_processing", "initialize_counters"]

    def test_exit_action_executed_on_transition(self):
        """Verify exit actions run when leaving a state."""
        machine = self._create_machine_in_state(MigrationState.RUNNING)

        machine.transition(MigrationState.PAUSED, context={"guard": "user_initiated"})

        assert machine.exit_actions_executed == ["pause_processing", "save_checkpoint"]

    def test_concurrent_transition_handling(self):
        """Verify concurrent transitions are serialized."""
        import threading

        machine = self._create_machine_in_state(MigrationState.RUNNING)
        results = []

        def attempt_pause():
            result = machine.transition(MigrationState.PAUSED, lock=True)
            results.append(("pause", result))

        def attempt_cancel():
            result = machine.transition(MigrationState.CANCELLED, lock=True)
            results.append(("cancel", result))

        t1 = threading.Thread(target=attempt_pause)
        t2 = threading.Thread(target=attempt_cancel)
        t1.start()
        t2.start()
        t1.join()
        t2.join()

        # Exactly one should succeed
        successes = [r for _, r in results if r.success]
        failures = [r for _, r in results if not r.success]
        assert len(successes) == 1
        assert len(failures) == 1

    def _create_machine_in_state(self, state: MigrationState):
        """Helper to create a state machine in a specific state."""
        from migration_engine.state_machine import MigrationStateMachine
        machine = MigrationStateMachine()
        # Fast-forward to desired state
        path = self._get_path_to_state(state)
        for transition in path:
            machine.transition(transition)
        return machine

    def _get_path_to_state(self, target: MigrationState) -> list:
        """Get the shortest path from CREATED to target state."""
        paths = {
            MigrationState.CREATED: [],
            MigrationState.PENDING: [MigrationState.PENDING],
            MigrationState.RUNNING: [MigrationState.PENDING, MigrationState.RUNNING],
            MigrationState.PAUSED: [MigrationState.PENDING, MigrationState.RUNNING, MigrationState.PAUSED],
            MigrationState.COMPLETED: [MigrationState.PENDING, MigrationState.RUNNING, MigrationState.COMPLETED],
            MigrationState.FAILED: [MigrationState.PENDING, MigrationState.RUNNING, MigrationState.FAILED],
            MigrationState.CANCELLED: [MigrationState.PENDING, MigrationState.CANCELLED],
        }
        return paths[target]
```

### 6.2 Error Recovery Testing

#### 6.2.1 Error Recovery Scenarios

| Scenario ID | Error Type | Recovery Mechanism | Expected Behavior |
|-------------|-----------|-------------------|-------------------|
| ER-001 | Transient database error | Automatic retry (3 attempts, exponential backoff) | Operation succeeds after retry |
| ER-002 | API gateway timeout | Client-side retry with circuit breaker | Fallback response or queue for later |
| ER-003 | Invalid data record | Skip and log, continue batch | Record marked FAILED, batch continues |
| ER-004 | Service unavailable | Circuit breaker open, degraded mode | User notified, core functions available |
| ER-005 | Network partition | Reconnection with state reconciliation | State synchronized after reconnection |
| ER-006 | Partial write failure | Transaction rollback | No partial data, migration restarts |
| ER-007 | Message queue backlog | Consumer scaling, dead-letter queue | Messages processed, poison pills isolated |

#### 6.2.2 Error Recovery Test Example

```python
# tests/system/test_error_recovery.py

import pytest
import requests
import time
from unittest.mock import patch, Mock


class TestErrorRecovery:
    """Validate error recovery mechanisms across the MAP system."""

    BASE_URL = "http://localhost:8080/api/v1"
    HEADERS = {"Authorization": "Bearer {{TEST_TOKEN}}"}

    def test_transient_database_error_recovery(self):
        """ER-001: System recovers from transient database errors via retry."""
        migration_id = self._create_test_migration()
        self._start_migration(migration_id)

        # Simulate transient DB error by monitoring retry behavior
        # In real test, this would use a fault injection proxy
        response = requests.get(
            f"{self.BASE_URL}/migrations/{migration_id}",
            headers=self.HEADERS
        )

        # Verify migration completed despite transient errors
        assert response.json()["status"] == "COMPLETED"
        assert response.json()["retryCount"] >= 1  # Retries occurred

    def test_invalid_record_skipped_batch_continues(self):
        """ER-003: Invalid records are skipped while batch processing continues."""
        migration_id = self._create_migration_with_mix_of_valid_and_invalid_records()
        self._start_migration(migration_id)

        self._wait_for_status(migration_id, "COMPLETED", timeout=120)

        response = requests.get(
            f"{self.BASE_URL}/migrations/{migration_id}",
            headers=self.HEADERS
        )
        data = response.json()

        assert data["status"] == "COMPLETED"
        assert data["recordsProcessed"] > 0
        assert data["recordsFailed"] > 0
        assert data["recordsProcessed"] + data["recordsFailed"] == data["totalRecords"]

    def test_circuit_breaker_opens_on_consecutive_failures(self):
        """ER-004: Circuit breaker opens after consecutive service failures."""
        # This test would use a fault injection tool (e.g., Istio, Toxiproxy)
        # to simulate consecutive failures
        pass  # Placeholder for fault injection test

    def test_partial_write_rollback(self):
        """ER-006: Partial write failures trigger full transaction rollback."""
        migration_id = self._create_test_migration()
        self._start_migration(migration_id)

        # Inject failure during write phase
        self._inject_write_failure(migration_id)

        # Verify no partial data exists
        response = requests.get(
            f"{self.BASE_URL}/migrations/{migration_id}/records",
            headers=self.HEADERS
        )

        records = response.json()["data"]
        for record in records:
            assert record["status"] in ["PENDING", "FAILED"], (
                f"Record {record['recordId']} has unexpected status: {record['status']}"
            )

    def _create_test_migration(self) -> str:
        response = requests.post(
            f"{self.BASE_URL}/migrations",
            json={
                "sourceSystem": "CORE_BANKING",
                "targetSystem": "CLOUD_MIGRATION",
                "recordType": "ACCOUNTS",
                "batchSize": 100
            },
            headers=self.HEADERS
        )
        return response.json()["migrationId"]

    def _start_migration(self, migration_id: str):
        requests.patch(
            f"{self.BASE_URL}/migrations/{migration_id}",
            json={"action": "start"},
            headers=self.HEADERS
        )

    def _wait_for_status(self, migration_id: str, target_status: str, timeout: int):
        start = time.time()
        while time.time() - start < timeout:
            response = requests.get(
                f"{self.BASE_URL}/migrations/{migration_id}",
                headers=self.HEADERS
            )
            if response.json()["status"] == target_status:
                return
            time.sleep(5)
        pytest.fail(f"Did not reach {target_status} within {timeout}s")
```

---

## 7. Configuration Testing

### 7.1 Environment Configuration Testing

Configuration testing validates that MAP behaves correctly under different configuration settings, feature flags, and runtime toggles.

#### 7.1.1 Configuration Test Categories

| Category | Description | Test Focus |
|----------|-------------|------------|
| Environment Variables | Runtime configuration via env vars | Correct values, fallback behavior |
| Feature Flags | Feature toggles and gates | Enable/disable features correctly |
| Database Config | Connection strings, pool settings | Connection, timeout, pool behavior |
| Cache Config | Redis configuration | TTL, eviction, fallback |
| API Config | Rate limits, timeouts, retry settings | Correct enforcement |
| Security Config | Auth settings, token expiry, CORS | Security enforcement |
| Logging Config | Log levels, outputs | Correct verbosity |

#### 7.1.2 Environment Configuration Test Matrix

| Config Key | Expected Value (DEV) | Expected Value (STG) | Expected Value (PROD) | Validation |
|-----------|---------------------|---------------------|----------------------|------------|
| `MAP_DB_CONNECTION_STRING` | Local/Dev SQL | Staging SQL | Production SQL | Connection success |
| `MAP_DB_POOL_SIZE` | 5 | 10 | 25 | Pool behavior |
| `MAP_CACHE_TTL` | 60 | 300 | 600 | TTL enforcement |
| `MAP_API_RATE_LIMIT` | 1000 | 500 | 100 | Rate enforcement |
| `MAP_LOG_LEVEL` | DEBUG | INFO | WARNING | Output verification |
| `MAP_FEATURE_AI_ENABLED` | true | true | true | Feature availability |
| `MAP_FEATURE_BETA_UI` | true | false | false | Toggle behavior |
| `MAP_AUTH_TOKEN_EXPIRY` | 24h | 8h | 1h | Token validation |
| `MAP_CORS_ORIGINS` | `*` | Specific domains | Specific domains | CORS enforcement |

#### 7.1.3 Configuration Test Example

```python
# tests/system/test_configuration.py

import pytest
import os
import requests
from typing import Dict, Any


class TestEnvironmentConfiguration:
    """Validate MAP behavior under different environment configurations."""

    def test_database_connection_uses_configured_connection_string(self):
        """Verify database connection uses the configured connection string."""
        config = self._get_service_config("validation-service")

        assert "MAP_DB_CONNECTION_STRING" in config
        assert config["MAP_DB_CONNECTION_STRING"] != ""

        # Verify actual connection
        health = requests.get(
            "http://localhost:8081/health",
            timeout=5
        )
        assert health.status_code == 200
        assert health.json()["database"]["status"] == "connected"

    def test_api_rate_limit_enforced(self):
        """Verify API rate limiting uses configured values."""
        config = self._get_service_config("api-gateway")
        rate_limit = int(config.get("MAP_API_RATE_LIMIT", 100))

        # Send requests up to rate limit
        responses = []
        for i in range(rate_limit + 10):
            response = requests.get(
                "http://localhost:8080/api/v1/migrations",
                headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
                timeout=5
            )
            responses.append(response.status_code)

        # Verify rate limiting kicks in
        assert 429 in responses, "Rate limiting not enforced"
        rate_limited_count = responses.count(429)
        assert rate_limited_count > 0

    def test_cache_ttl_respected(self):
        """Verify Redis cache TTL is respected."""
        config = self._get_service_config("validation-service")
        expected_ttl = int(config.get("MAP_CACHE_TTL", 300))

        # Make first request (should cache)
        response1 = requests.get(
            "http://localhost:8080/api/v1/migrations?status=COMPLETED",
            headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
            timeout=5
        )
        assert response1.status_code == 200

        # Check cache headers
        cache_control = response1.headers.get("Cache-Control", "")
        assert f"max-age={expected_ttl}" in cache_control or "no-cache" not in cache_control

    def test_feature_flag_toggles_feature(self):
        """Verify feature flag correctly enables/disables feature."""
        config = self._get_service_config("web-app")
        ai_enabled = config.get("MAP_FEATURE_AI_ENABLED", "false").lower() == "true"

        # Check AI feature availability
        response = requests.get(
            "http://localhost:3000/api/features",
            timeout=5
        )
        features = response.json()

        if ai_enabled:
            assert features.get("aiAnalysis") is True
        else:
            assert features.get("aiAnalysis") is False

    def test_cors_origins_configured_correctly(self):
        """Verify CORS origins match configuration."""
        config = self._get_service_config("api-gateway")
        allowed_origins = config.get("MAP_CORS_ORIGINS", "").split(",")

        # Test with allowed origin
        response = requests.options(
            "http://localhost:8080/api/v1/migrations",
            headers={
                "Origin": allowed_origins[0].strip(),
                "Access-Control-Request-Method": "GET"
            },
            timeout=5
        )

        assert response.status_code == 200
        assert "Access-Control-Allow-Origin" in response.headers

    def test_log_level_affects_output(self):
        """Verify log level configuration affects logging output."""
        config = self._get_service_config("validation-service")
        log_level = config.get("MAP_LOG_LEVEL", "INFO")

        # Trigger an operation
        requests.get(
            "http://localhost:8081/health",
            timeout=5
        )

        # Check logs (in real test, would inspect log aggregator)
        # This is a placeholder for actual log verification
        assert log_level in ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]

    def _get_service_config(self, service_name: str) -> Dict[str, Any]:
        """Retrieve configuration for a specific service."""
        config_endpoints = {
            "api-gateway": "http://localhost:8080/config",
            "validation-service": "http://localhost:8081/config",
            "notification-service": "http://localhost:8082/config",
            "web-app": "http://localhost:3000/config",
        }
        try:
            response = requests.get(
                config_endpoints.get(service_name, ""),
                timeout=5
            )
            return response.json()
        except Exception:
            return {}
```

### 7.2 Feature Flag Testing

#### 7.2.1 Feature Flag Test Scenarios

| Flag Name | Default | Test Scenario | Expected Behavior |
|-----------|---------|---------------|-------------------|
| `FEATURE_AI_ANALYSIS` | true | Flag ON | AI analysis available in migration reports |
| `FEATURE_AI_ANALYSIS` | true | Flag OFF | AI analysis hidden, manual analysis only |
| `FEATURE_BETA_UI` | false | Flag ON (DEV) | New UI components visible |
| `FEATURE_BETA_UI` | false | Flag OFF (PROD) | Legacy UI components used |
| `FEATURE_AUDIT_LOGGING` | true | Flag ON | All operations logged to audit trail |
| `FEATURE_AUDIT_LOGGING` | true | Flag OFF | Audit logging disabled for performance |
| `FEATURE_EMAIL_NOTIFICATIONS` | true | Flag ON | Email notifications sent |
| `FEATURE_EMAIL_NOTIFICATIONS` | true | Flag OFF | Notifications queued but not sent |

---

## 8. Environment Validation

### 8.1 Infrastructure Verification

Environment validation ensures that all infrastructure components are healthy, properly configured, and accessible before system tests execute.

#### 8.1.1 Infrastructure Health Check Matrix

| Component | Health Check Endpoint | Expected Response | Timeout | Critical |
|-----------|----------------------|-------------------|---------|----------|
| API Gateway | `GET /health` | `{"status": "healthy"}` | 5s | Yes |
| Validation Service | `GET /health` | `{"status": "healthy", "db": "connected"}` | 5s | Yes |
| Discovery Service | `GET /health` | `{"status": "healthy"}` | 5s | Yes |
| Notification Service | `GET /health` | `{"status": "healthy"}` | 5s | No |
| Reporting Service | `GET /health` | `{"status": "healthy"}` | 5s | No |
| AI Service | `GET /health` | `{"status": "healthy", "model": "loaded"}` | 10s | No |
| Azure SQL | `SELECT 1` | Result set | 5s | Yes |
| Redis | `PING` | `PONG` | 3s | Yes |
| Blob Storage | `GET /` | 200 OK | 10s | No |
| Key Vault | `GET /` | 200 OK | 5s | Yes |

#### 8.1.2 Infrastructure Validation Test Example

```python
# tests/system/test_infrastructure_health.py

import pytest
import requests
import time
from typing import List, Tuple


class TestInfrastructureHealth:
    """Validate all infrastructure components are healthy before system tests."""

    HEALTH_ENDPOINTS = {
        "api_gateway": ("http://localhost:8080/health", 5),
        "validation_service": ("http://localhost:8081/health", 5),
        "discovery_service": ("http://localhost:8082/health", 5),
        "notification_service": ("http://localhost:8083/health", 5),
        "reporting_service": ("http://localhost:8084/health", 5),
        "ai_service": ("http://localhost:8085/health", 10),
    }

    CRITICAL_SERVICES = ["api_gateway", "validation_service"]

    @pytest.fixture(autouse=True, scope="session")
    def validate_all_services(self):
        """Pre-flight check: verify all services are healthy."""
        unhealthy = self._check_all_services()
        if unhealthy:
            pytest.skip(
                f"Infrastructure not ready. Unhealthy services: {unhealthy}"
            )

    def test_api_gateway_healthy(self):
        """Verify API Gateway is responding correctly."""
        response = requests.get(
            self.HEALTH_ENDPOINTS["api_gateway"][0],
            timeout=self.HEALTH_ENDPOINTS["api_gateway"][1]
        )
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

    def test_validation_service_healthy(self):
        """Verify Validation Service is responding with DB connection."""
        response = requests.get(
            self.HEALTH_ENDPOINTS["validation_service"][0],
            timeout=self.HEALTH_ENDPOINTS["validation_service"][1]
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["database"]["status"] == "connected"

    def test_database_connectivity(self):
        """Verify Azure SQL database is accessible."""
        response = requests.get(
            "http://localhost:8081/health/database",
            timeout=5
        )
        assert response.status_code == 200
        assert response.json()["status"] == "connected"
        assert response.json()["latencyMs"] < 100

    def test_redis_connectivity(self):
        """Verify Redis cache is accessible."""
        response = requests.get(
            "http://localhost:8081/health/cache",
            timeout=5
        )
        assert response.status_code == 200
        assert response.json()["status"] == "connected"

    def test_key_vault_accessibility(self):
        """Verify Azure Key Vault is accessible."""
        response = requests.get(
            "http://localhost:8081/health/secrets",
            timeout=5
        )
        assert response.status_code == 200
        assert response.json()["status"] == "accessible"

    def test_cross_service_connectivity(self):
        """Verify all services can communicate with each other."""
        response = requests.get(
            "http://localhost:8080/health/connectivity",
            timeout=10
        )
        assert response.status_code == 200
        connectivity = response.json()["services"]

        for service, status in connectivity.items():
            assert status["status"] == "reachable", (
                f"Service {service} unreachable: {status.get('error')}"
            )

    def test_all_services_respond_within_sla(self):
        """Verify all health checks complete within defined SLA."""
        results = []
        for name, (url, timeout) in self.HEALTH_ENDPOINTS.items():
            start = time.time()
            try:
                response = requests.get(url, timeout=timeout)
                elapsed = time.time() - start
                results.append((name, response.status_code, elapsed))
            except Exception as e:
                elapsed = time.time() - start
                results.append((name, 0, elapsed))

        for name, status_code, elapsed in results:
            assert status_code == 200, f"Service {name} returned {status_code}"
            assert elapsed < 5.0, f"Service {name} took {elapsed:.2f}s (> 5s SLA)"

    def _check_all_services(self) -> List[str]:
        """Check all services and return list of unhealthy ones."""
        unhealthy = []
        for name, (url, timeout) in self.HEALTH_ENDPOINTS.items():
            try:
                response = requests.get(url, timeout=timeout)
                if response.status_code != 200:
                    unhealthy.append(name)
            except Exception:
                unhealthy.append(name)
        return unhealthy
```

### 8.2 Service Health Dashboard Test

```python
# tests/system/test_service_health_dashboard.py

import pytest
import requests


class TestServiceHealthDashboard:
    """Validate the service health dashboard displays correct information."""

    DASHBOARD_URL = "http://localhost:3000/admin/health"

    @pytest.fixture(autouse=True)
    def setup(self, authenticated_admin):
        self.page = authenticated_admin

    def test_dashboard_displays_all_service_statuses(self):
        """Verify health dashboard shows status for all registered services."""
        self.page.goto(self.DASHBOARD_URL)

        expected_services = [
            "API Gateway", "Validation Service", "Discovery Service",
            "Notification Service", "Reporting Service", "AI Service",
            "Azure SQL", "Redis", "Blob Storage", "Key Vault"
        ]

        for service in expected_services:
            assert self.page.locator(
                f'[data-testid="service-status-{service.lower().replace(" ", "-")}"]'
            ).is_visible()

    def test_dashboard_shows_real_time_updates(self):
        """Verify health dashboard updates in real-time."""
        self.page.goto(self.DASHBOARD_URL)

        # Get initial timestamp
        initial_time = self.page.locator(
            '[data-testid="last-updated"]'
        ).text_content()

        # Wait for refresh (typically 30 seconds)
        self.page.wait_for_timeout(35000)

        # Verify timestamp updated
        updated_time = self.page.locator(
            '[data-testid="last-updated"]'
        ).text_content()
        assert initial_time != updated_time
```

---

## 9. Test Scenario Design

### 9.1 Given-When-Then Format

MAP adopts the Given-When-Then (GWT) format for all system test scenarios. This format provides clear, structured test cases that are readable by both technical and business stakeholders.

#### 9.1.1 GWT Structure

| Section | Purpose | MAP Guidelines |
|---------|---------|----------------|
| **Given** | Set up the preconditions | Describe the initial system state, data setup, and environment |
| **When** | Execute the action under test | Describe the user action or system event being tested |
| **Then** | Verify the expected outcome | Describe verifiable expected results with specific assertions |
| **And** | Additional conditions | Extend any section with related conditions |
| **But** | Contrast/negative conditions | Specify what should NOT happen |

#### 9.1.2 GWT Examples for MAP

```gherkin
# Scenario: Migration creation with validation

@system @migration @critical
Scenario: Create migration with valid configuration
  Given I am authenticated as a Migration Engineer
  And the source system "CORE_BANKING" is available
  And the target system "CLOUD_MIGRATION" is accessible
  And I have permissions to create migrations

  When I create a migration with:
    | field           | value         |
    | sourceSystem    | CORE_BANKING  |
    | targetSystem    | CLOUD_MIGRATION |
    | recordType      | ACCOUNTS      |
    | batchSize       | 500           |
    | priority        | HIGH          |

  Then the migration should be created with status "PENDING"
  And the migration should have a unique UUID identifier
  And the creation should be recorded in the audit trail
  And I should receive a notification with the migration details
  And the dashboard should show the new migration in my project list

# Scenario: Migration with invalid configuration

@system @migration @negative
Scenario: Reject migration with missing required fields
  Given I am authenticated as a Migration Engineer

  When I attempt to create a migration with:
    | field           | value         |
    | sourceSystem    |               |
    | targetSystem    | CLOUD_MIGRATION |
    | recordType      |               |

  Then the migration should not be created
  And I should receive a validation error with:
    | field         | error_message                |
    | sourceSystem  | Source system is required     |
    | recordType    | Record type is required       |
  And no audit trail entry should be created
```

### 9.2 Behavior-Driven Development Integration

#### 9.2.1 BDD Tool Chain

| Component | Tool | Purpose |
|-----------|------|---------|
| Feature Files | Gherkin (`.feature`) | Scenario definitions |
| Step Definitions | Python (pytest-bdd) / TypeScript | Code implementing scenarios |
| Hooks | pytest-bdd hooks | Setup/teardown per scenario |
| Tags | `@tag` annotations | Scenario categorization |
| Reporters | Allure / Behave | BDD execution reports |

#### 9.2.2 BDD Step Definitions Example (pytest-bdd)

```python
# tests/system/bdd/test_migration_creation.feature

Feature: Migration Creation
  As a Migration Engineer
  I want to create data migration projects
  So that I can migrate data between systems

  Background:
    Given the MAP platform is operational
    And I am authenticated with valid credentials

  @smoke @critical
  Scenario: Successful migration creation
    Given the source system "CORE_BANKING" is available
    When I create a migration with source "CORE_BANKING" and target "CLOUD_MIGRATION"
    Then the migration should be created with status "PENDING"
    And I should see the migration in my project list

  @negative
  Scenario: Migration creation fails with invalid source
    Given the source system "NON_EXISTENT" is not available
    When I attempt to create a migration with source "NON_EXISTENT"
    Then I should receive an error notification
    And the migration should not be created
```

```python
# tests/system/bdd/test_migration_creation.py

import pytest
from pytest_bdd import scenario, given, when, then, parsers
import requests


@scenario("test_migration_creation.feature", "Successful migration creation")
def test_successful_migration_creation():
    pass


@scenario("test_migration_creation.feature", "Migration creation fails with invalid source")
def test_migration_creation_fails_with_invalid_source():
    pass


@given("the MAP platform is operational")
def map_platform_operational():
    response = requests.get("http://localhost:8080/health", timeout=5)
    assert response.status_code == 200


@given("I am authenticated with valid credentials")
def authenticated_user():
    # Setup authenticated session
    pass


@given(parsers.parse('the source system "{system}" is available'))
def source_system_available(system):
    response = requests.get(
        f"http://localhost:8080/api/v1/systems/{system}/status",
        headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
        timeout=5
    )
    assert response.status_code == 200
    assert response.json()["status"] == "AVAILABLE"


@given(parsers.parse('the source system "{system}" is not available'))
def source_system_not_available(system):
    # In real test, this would mock the system status
    pass


@when(parsers.parse(
    'I create a migration with source "{source}" and target "{target}"'
))
def create_migration(source, target):
    response = requests.post(
        "http://localhost:8080/api/v1/migrations",
        json={
            "sourceSystem": source,
            "targetSystem": target,
            "recordType": "ACCOUNTS",
            "batchSize": 500
        },
        headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
        timeout=10
    )
    assert response.status_code == 201
    return response.json()


@when(parsers.parse('I attempt to create a migration with source "{source}"'))
def attempt_create_migration(source):
    response = requests.post(
        "http://localhost:8080/api/v1/migrations",
        json={
            "sourceSystem": source,
            "targetSystem": "CLOUD_MIGRATION",
            "recordType": "ACCOUNTS"
        },
        headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
        timeout=10
    )
    return response


@then(parsers.parse('the migration should be created with status "{status}"'))
def migration_created_with_status(create_migration, status):
    assert create_migration["status"] == status


@then("I should see the migration in my project list")
def migration_in_project_list(create_migration):
    response = requests.get(
        "http://localhost:8080/api/v1/migrations",
        headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
        timeout=5
    )
    migration_ids = [m["migrationId"] for m in response.json()["data"]]
    assert create_migration["migrationId"] in migration_ids


@then("I should receive an error notification")
def error_notification_received(attempt_create_migration):
    assert attempt_create_migration.status_code >= 400


@then("the migration should not be created")
def migration_not_created(attempt_create_migration):
    assert attempt_create_migration.status_code >= 400
```

---

## 10. Test Data Requirements

### 10.1 End-to-End Test Data

System tests require realistic, comprehensive test data that covers all business scenarios while maintaining data integrity across the complete system.

#### 10.1.1 Test Data Categories

| Category | Volume | Characteristics | Source |
|----------|--------|-----------------|--------|
| Migration Projects | 50+ | Various states, sizes, record types | Factory-generated |
| Account Records | 10,000+ | Valid financial data, various statuses | Synthetic generator |
| Transaction Records | 50,000+ | Temporal data, amounts, currencies | Synthetic generator |
| User Accounts | 20+ | Various roles, permissions, statuses | Factory-generated |
| Validation Rules | 100+ | Business rules, data quality rules | Configuration files |
| Audit Trail Entries | 500+ | All action types, various timestamps | Generated during tests |

#### 10.1.2 Test Data Requirements

| Requirement | Description | Justification |
|-------------|-------------|---------------|
| Representativeness | Data must reflect real-world patterns | Ensure tests validate actual usage |
| Completeness | Cover all data types, edge cases, and combinations | Prevent data-related defects |
| Isolation | Each test must have its own data scope | Ensure test independence |
| Refreshability | Data can be regenerated consistently | Enable repeatable test runs |
| Compliance | No real PII or financial data | Security and privacy compliance |
| Volume | Sufficient data to test performance | Validate under realistic load |

#### 10.1.3 Test Data Factory Example

```python
# tests/system/factories.py

import factory
from faker import Faker
from decimal import Decimal
import uuid
from datetime import datetime, timedelta

fake = Faker()


class MigrationProjectFactory:
    """Factory for creating migration project test data."""

    @staticmethod
    def create(
        status: str = "PENDING",
        record_count: int = 1000,
        source_system: str = "CORE_BANKING",
        target_system: str = "CLOUD_MIGRATION"
    ) -> dict:
        return {
            "migrationId": str(uuid.uuid4()),
            "status": status,
            "sourceSystem": source_system,
            "targetSystem": target_system,
            "recordType": "ACCOUNTS",
            "totalRecords": record_count,
            "recordsProcessed": 0 if status == "PENDING" else record_count,
            "recordsFailed": 0,
            "batchSize": 500,
            "priority": "HIGH",
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat(),
            "createdBy": "migration.eng01"
        }

    @staticmethod
    def create_batch(count: int = 10, **kwargs) -> list:
        return [MigrationProjectFactory.create(**kwargs) for _ in range(count)]


class AccountRecordFactory:
    """Factory for creating account record test data."""

    STATUSES = ["ACTIVE", "INACTIVE", "FROZEN", "CLOSED"]
    ACCOUNT_TYPES = ["CHECKING", "SAVINGS", "INVESTMENT", "LOAN"]
    CURRENCIES = ["USD", "EUR", "GBP", "AUD", "CAD"]

    @staticmethod
    def create(**kwargs) -> dict:
        defaults = {
            "accountId": f"ACC-{fake.uuid4()[:8]}",
            "accountHolder": fake.name(),
            "accountType": fake.random_element(AccountRecordFactory.ACCOUNT_TYPES),
            "balance": Decimal(str(fake.pydecimal(
                left_digits=6, right_digits=2, positive=True
            ))),
            "currency": fake.random_element(AccountRecordFactory.CURRENCIES),
            "status": fake.random_element(AccountRecordFactory.STATUSES),
            "openedDate": fake.date_time_between(
                start_date="-10y", end_date="now"
            ).isoformat(),
            "branchCode": fake.numerify("BR-###"),
            "customerSegment": fake.random_element(
                ["RETAIL", "CORPORATE", "WEALTH", "SME"]
            )
        }
        defaults.update(kwargs)
        return defaults

    @staticmethod
    def create_batch(count: int = 100, **kwargs) -> list:
        return [AccountRecordFactory.create(**kwargs) for _ in range(count)]

    @staticmethod
    def create_with_validation_errors(count: int = 5) -> list:
        """Create records that will fail various validation rules."""
        error_records = [
            # Missing required field
            {"accountId": "ACC-ERROR-001", "accountHolder": None},
            # Invalid balance
            {"accountId": "ACC-ERROR-002", "balance": Decimal("-100.00")},
            # Invalid currency
            {"accountId": "ACC-ERROR-003", "currency": "INVALID"},
            # Future open date
            {"accountId": "ACC-ERROR-004", "openedDate": "2030-01-01"},
            # Exceeds maximum balance
            {"accountId": "ACC-ERROR-005", "balance": Decimal("99999999999.99")},
        ]
        return error_records


class UserFactory:
    """Factory for creating user test data."""

    ROLES = ["ADMIN", "ENGINEER", "VIEWER", "AUDITOR"]

    @staticmethod
    def create(role: str = "ENGINEER", **kwargs) -> dict:
        defaults = {
            "userId": str(uuid.uuid4()),
            "username": fake.user_name(),
            "email": fake.email(),
            "role": role,
            "status": "ACTIVE",
            "createdAt": datetime.utcnow().isoformat(),
            "lastLogin": None,
            "permissions": UserFactory._get_permissions_for_role(role)
        }
        defaults.update(kwargs)
        return defaults

    @staticmethod
    def _get_permissions_for_role(role: str) -> list:
        permissions = {
            "ADMIN": ["create", "read", "update", "delete", "manage_users", "configure"],
            "ENGINEER": ["create", "read", "update", "execute_migrations"],
            "VIEWER": ["read"],
            "AUDITOR": ["read", "export", "audit_trail"]
        }
        return permissions.get(role, ["read"])
```

### 10.2 State Management

#### 10.2.1 Test State Setup and Teardown

```python
# tests/system/conftest.py

import pytest
import requests
import time
from factories import MigrationProjectFactory, AccountRecordFactory, UserFactory


@pytest.fixture(scope="session")
def test_environment():
    """Validate test environment is ready before any tests run."""
    # Verify all services are healthy
    health = requests.get("http://localhost:8080/health", timeout=5)
    assert health.status_code == 200, "Test environment not healthy"
    yield
    # Session teardown: cleanup test data


@pytest.fixture(scope="function")
def fresh_migration():
    """Create a fresh migration for each test function."""
    migration = MigrationProjectFactory.create()
    # Setup via API
    response = requests.post(
        "http://localhost:8080/api/v1/migrations",
        json=migration,
        headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
        timeout=10
    )
    assert response.status_code == 201
    migration_id = response.json()["migrationId"]

    yield response.json()

    # Teardown: delete migration
    requests.delete(
        f"http://localhost:8080/api/v1/migrations/{migration_id}",
        headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
        timeout=10
    )


@pytest.fixture(scope="function")
def migration_with_records():
    """Create a migration populated with test records."""
    migration = MigrationProjectFactory.create(record_count=100)
    response = requests.post(
        "http://localhost:8080/api/v1/migrations",
        json=migration,
        headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
        timeout=10
    )
    migration_id = response.json()["migrationId"]

    # Load test records
    records = AccountRecordFactory.create_batch(count=100)
    requests.post(
        f"http://localhost:8080/api/v1/migrations/{migration_id}/records",
        json={"records": records},
        headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
        timeout=30
    )

    yield response.json()

    # Teardown
    requests.delete(
        f"http://localhost:8080/api/v1/migrations/{migration_id}",
        headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
        timeout=10
    )


@pytest.fixture(scope="function")
def running_migration(migration_with_records):
    """Create a migration and start it."""
    migration_id = migration_with_records["migrationId"]
    requests.patch(
        f"http://localhost:8080/api/v1/migrations/{migration_id}",
        json={"action": "start"},
        headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
        timeout=10
    )
    return migration_with_records


@pytest.fixture(scope="function")
def completed_migration(migration_with_records):
    """Create a migration and wait for completion."""
    migration_id = migration_with_records["migrationId"]
    requests.patch(
        f"http://localhost:8080/api/v1/migrations/{migration_id}",
        json={"action": "start"},
        headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
        timeout=10
    )

    # Wait for completion
    start = time.time()
    while time.time() - start < 300:
        response = requests.get(
            f"http://localhost:8080/api/v1/migrations/{migration_id}",
            headers={"Authorization": "Bearer {{TEST_TOKEN}}"},
            timeout=5
        )
        if response.json()["status"] == "COMPLETED":
            return response.json()
        time.sleep(5)

    pytest.fail("Migration did not complete within 300s")


@pytest.fixture
def authenticated_admin():
    """Provide authenticated admin user session."""
    return {"userId": "admin-001", "role": "ADMIN", "token": "{{ADMIN_TOKEN}}"}
```

---

## 11. Environment Management

### 11.1 Environment Setup

#### 11.1.1 Environment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SYSTEM TEST ENVIRONMENT                    │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    AZURE SUBSCRIPTION                    │ │
│  │                                                          │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │ │
│  │  │ Container   │  │ API Mgmt    │  │ SQL Database│     │ │
│  │  │ Apps (TEST) │  │ (TEST)      │  │ (TEST)      │     │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │ │
│  │  │ Redis       │  │ Blob Storage│  │ Key Vault   │     │ │
│  │  │ (TEST)      │  │ (TEST)      │  │ (TEST)      │     │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    TEST INFRASTRUCTURE                    │ │
│  │                                                          │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │ │
│  │  │ Test Runner │  │ Data Factory│  │ Report Svc  │     │ │
│  │  │ (Playwright)│  │             │  │ (Allure)    │     │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### 11.1.2 Environment Setup Checklist

| # | Task | Owner | Verification |
|---|------|-------|-------------|
| 1 | Azure subscription provisioned | DevOps | Subscription active |
| 2 | Resource group created | DevOps | `az group show` |
| 3 | Azure SQL deployed | DevOps | Connection test |
| 4 | Redis cache deployed | DevOps | Ping test |
| 5 | Container Apps deployed | DevOps | Health check |
| 6 | API Management configured | DevOps | Gateway accessible |
| 7 | Key Vault secrets loaded | DevOps | Secret retrieval test |
| 8 | Test data loaded | QA | Record count verification |
| 9 | Feature flags configured | DevOps | Flag value verification |
| 10 | Monitoring configured | DevOps | Alert test |

### 11.2 Environment Teardown

#### 11.2.1 Teardown Procedure

| # | Task | Trigger | Method |
|---|------|---------|--------|
| 1 | Delete test migrations | After each test run | API cleanup script |
| 2 | Reset test data | Before each test run | Data refresh script |
| 3 | Clear caches | Before each test run | Redis FLUSHDB |
| 4 | Reset feature flags | After each test run | Config reset script |
| 5 | Archive test reports | After each test run | CI/CD artifact step |
| 6 | Scale down resources | After test window | Azure CLI |

#### 11.2.2 Teardown Script Example

```bash
#!/bin/bash
# scripts/teardown-system-test-env.sh

set -euo pipefail

echo "Starting system test environment teardown..."

# 1. Delete test migrations
echo "Deleting test migrations..."
curl -s -X DELETE \
  -H "Authorization: Bearer ${TEST_TOKEN}" \
  "http://localhost:8080/api/v1/migrations?testOnly=true" || true

# 2. Clear Redis cache
echo "Clearing Redis cache..."
redis-cli -h localhost -p 6380 FLUSHDB

# 3. Reset feature flags
echo "Resetting feature flags..."
curl -s -X POST \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"flags": {"FEATURE_BETA_UI": false, "FEATURE_AI_ENABLED": true}}' \
  "http://localhost:8080/admin/config/flags"

# 4. Archive test reports
echo "Archiving test reports..."
ARCHIVE_DIR="/tmp/map-test-reports/$(date +%Y%m%d-%H%M%S)"
mkdir -p "${ARCHIVE_DIR}"
cp -r test-reports/* "${ARCHIVE_DIR}/" 2>/dev/null || true

# 5. Scale down resources (non-production only)
if [ "${ENVIRONMENT}" != "production" ]; then
  echo "Scaling down test resources..."
  az containerapp update \
    --name map-validation-test \
    --resource-group map-test-rg \
    --min-replicas 0 \
    --max-replicas 0
fi

echo "Teardown complete."
```

### 11.3 Environment Refresh

#### 11.3.1 Refresh Strategy

| Scenario | Frequency | Scope | Downtime |
|----------|-----------|-------|----------|
| Full refresh | Weekly | All data and configuration | 30 minutes |
| Data refresh | Before each test run | Test data only | 5 minutes |
| Config refresh | On-demand | Feature flags, settings | Immediate |
| Service refresh | After deployment | Application services | 5 minutes |

#### 11.3.2 Data Refresh Script

```python
# scripts/refresh_test_data.py

import requests
import json
from typing import List


class TestDataRefresher:
    """Refresh system test data to a known good state."""

    BASE_URL = "http://localhost:8080/api/v1"
    HEADERS = {"Authorization": "Bearer {{TEST_TOKEN}}"}

    def full_refresh(self):
        """Complete data refresh to known state."""
        print("Starting full data refresh...")

        # 1. Clean existing test data
        self._clean_test_migrations()

        # 2. Load base dataset
        self._load_base_dataset()

        # 3. Configure feature flags
        self._reset_feature_flags()

        # 4. Verify refresh
        self._verify_data_integrity()

        print("Data refresh complete.")

    def _clean_test_migrations(self):
        """Remove all test migrations."""
        response = requests.get(
            f"{self.BASE_URL}/migrations?testOnly=true",
            headers=self.HEADERS
        )
        for migration in response.json().get("data", []):
            requests.delete(
                f"{self.BASE_URL}/migrations/{migration['migrationId']}",
                headers=self.HEADERS
            )
        print(f"Cleaned {len(response.json().get('data', []))} test migrations")

    def _load_base_dataset(self):
        """Load the base test dataset."""
        base_data = json.load(open("tests/system/data/base_dataset.json"))

        for migration_data in base_data["migrations"]:
            requests.post(
                f"{self.BASE_URL}/migrations",
                json=migration_data,
                headers=self.HEADERS
            )

        print(f"Loaded {len(base_data['migrations'])} base migrations")

    def _reset_feature_flags(self):
        """Reset all feature flags to defaults."""
        requests.post(
            "http://localhost:8080/admin/config/flags/reset",
            headers=self.HEADERS
        )
        print("Feature flags reset to defaults")

    def _verify_data_integrity(self):
        """Verify data refresh was successful."""
        response = requests.get(
            f"{self.BASE_URL}/migrations?testOnly=true",
            headers=self.HEADERS
        )
        count = len(response.json().get("data", []))
        assert count > 0, "Data refresh failed: no migrations found"
        print(f"Verified {count} test migrations in system")


if __name__ == "__main__":
    refresher = TestDataRefresher()
    refresher.full_refresh()
```

---

## 12. Recommended Tools and Frameworks

### 12.1 Browser Automation Tools

| Tool | Version | Purpose | MAP Usage | License |
|------|---------|---------|-----------|---------|
| **Playwright** | 1.45+ | E2E browser testing | Primary E2E framework | Apache 2.0 |
| **Cypress** | 13+ | Component/E2E testing | Alternative for React components | MIT |
| **Selenium WebDriver** | 4.x | Legacy browser testing | Compatibility testing | Apache 2.0 |

### 12.2 API Testing Tools

| Tool | Purpose | MAP Usage |
|------|---------|-----------|
| **requests (Python)** | HTTP client for API tests | Primary API test client |
| **REST Assured** | Java API testing | Java service integration tests |
| **Postman/Newman** | API exploration and automation | API validation and collection testing |
| **httpx** | Async HTTP client | Async API test scenarios |

### 12.3 Test Framework Tools

| Tool | Purpose | MAP Usage |
|------|---------|-----------|
| **pytest** | Python test framework | Primary test runner |
| **pytest-bdd** | BDD support for pytest | Gherkin scenario execution |
| **Allure** | Test reporting | System test report generation |
| **Allure-pytest** | Allure + pytest integration | Automatic report attachment |

### 12.4 Infrastructure Tools

| Tool | Purpose | MAP Usage |
|------|---------|-----------|
| **Docker Compose** | Local environment setup | Developer system testing |
| **Terraform** | Infrastructure provisioning | Test environment provisioning |
| **Azure CLI** | Azure resource management | Environment management |
| **Toxiproxy** | Network fault injection | Resilience testing |

### 12.5 Playwright Configuration Example

```python
# playwright.config.ts

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/system/e2e',
  fullyParallel: false,  // System tests run sequentially
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright'],
    ['junit', { outputFile: 'test-results/system-e2e.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
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
  ],
  timeout: 300000,  // 5 minute timeout per test
  expect: {
    timeout: 10000,  // 10 second assertion timeout
  },
});
```

### 12.6 Tool Selection Matrix

| Criterion | Playwright | Cypress | Selenium |
|-----------|-----------|---------|----------|
| **Speed** | Fast | Medium | Slow |
| **Multi-browser** | Yes (3 engines) | Yes (2 engines) | Yes (4+ engines) |
| **Auto-wait** | Built-in | Built-in | Manual |
| **Network interception** | Yes | Yes | Limited |
| **Parallel execution** | Yes | Yes | Yes |
| **Mobile testing** | Yes | Limited | Yes |
| **Community** | Growing | Strong | Mature |
| **MAP Recommendation** | **Primary** | Alternative | Legacy only |

---

## 13. Best Practices

### 13.1 Test Complete Flows

System tests must exercise complete user journeys from start to finish. Avoid testing isolated steps or individual API endpoints in system tests — those belong in integration tests.

| Practice | Description | Example |
|----------|-------------|---------|
| Test the full journey | Every test covers a complete user workflow | Login → Create → Execute → Report |
| Verify all layers | Check UI, API, database, and events | UI shows success, DB has record, event emitted |
| Use realistic data | Test data must reflect production complexity | 1000+ records, multiple record types |
| Test across services | Verify multi-service orchestration | Validation Service → AI Service → Reporting |

### 13.2 Verify Integrations

System tests must verify that all integrations between MAP components work correctly end-to-end.

| Integration | Verification Method |
|-------------|-------------------|
| Web App → API Gateway | Playwright intercepts and validates HTTP requests |
| API Gateway → Services | Verify request routing and response aggregation |
| Services → Database | Verify data persistence after operations |
| Services → Cache | Verify cache hit/miss behavior |
| Services → Event Bus | Verify events published and consumed |
| Services → External APIs | Verify third-party integration responses |

### 13.3 Test Error Scenarios

System tests must validate error handling and recovery at the system level.

| Error Scenario | Test Approach |
|----------------|--------------|
| Service unavailability | Kill service, verify graceful degradation |
| Database failure | Inject DB errors, verify retry and recovery |
| Network timeout | Inject latency, verify timeout handling |
| Invalid input | Submit invalid data, verify error messages |
| Partial failure | Fail mid-batch, verify data consistency |
| Concurrent conflicts | Simultaneous edits, verify conflict resolution |

### 13.4 Test Data Isolation

| Practice | Description |
|----------|-------------|
| Test-scoped data | Each test creates and cleans up its own data |
| No shared state | Tests must not depend on execution order |
| Unique identifiers | Use UUIDs to prevent data collisions |
| Cleanup after failure | Fixtures must clean up even on test failure |
| Deterministic data | Avoid random data that produces non-deterministic results |

### 13.5 Maintainability

| Practice | Description |
|----------|-------------|
| Page Object Model | Encapsulate UI interactions in page objects |
| API Client Objects | Encapsulate API calls in client classes |
| Shared fixtures | Use conftest.py for common test setup |
| Descriptive names | Test names must clearly describe the scenario |
| Living documentation | Tests serve as executable specifications |
| Regular maintenance | Review and update tests every sprint |

### 13.6 System Test Anti-Patterns

| Anti-Pattern | Problem | Correct Approach |
|--------------|---------|------------------|
| Testing too much at E2E level | Slow, brittle tests | Push logic down to unit/integration |
| Hardcoded test data | Fragile tests that break on data changes | Use factories and dynamic data |
| No cleanup | Test pollution, flaky tests | Use fixtures with teardown |
| Chaining test dependencies | Tests fail in cascade | Each test is independent |
| Ignoring environment state | Flaky results from dirty environments | Pre-flight checks, clean environments |
| No error path testing | Only happy path covered | Include negative and edge case scenarios |
| Excessive assertions | Hard to diagnose failures | Focus on key outcomes per test |

---

## 14. Test Execution and Reporting

### 14.1 Execution Pipeline

```yaml
# .github/workflows/system-tests.yml

name: System Tests

on:
  workflow_dispatch:
  schedule:
    - cron: '0 6 * * 1-5'  # Weekdays at 6 AM
  push:
    branches: [main, release/*]

env:
  TEST_ENVIRONMENT: staging
  MAP_API_URL: http://staging-api.map.local
  MAP_WEB_URL: http://staging-web.map.local

jobs:
  preflight:
    runs-on: ubuntu-latest
    outputs:
      environment_ready: ${{ steps.check.outputs.ready }}
    steps:
      - name: Check environment health
        id: check
        run: |
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" $MAP_API_URL/health)
          echo "ready=$( [ $STATUS -eq 200 ] && echo true || echo false )" >> $GITHUB_OUTPUT

  system-tests:
    needs: preflight
    if: needs.preflight.outputs.environment_ready == 'true'
    runs-on: ubuntu-latest
    timeout-minutes: 60

    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install -r requirements-test.txt
          npx playwright install --with-deps

      - name: Refresh test data
        run: python scripts/refresh_test_data.py

      - name: Run system tests
        run: |
          pytest tests/system/ \
            --tb=short \
            --junitxml=test-results/system-tests.xml \
            --alluredir=allure-results \
            -v

      - name: Generate Allure report
        if: always()
        uses: simple-elf/allure-report-action@master
        with:
          allure_results: allure-results

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: system-test-results
          path: |
            test-results/
            allure-results/

      - name: Publish test report
        if: always()
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: allure-report
```

### 14.2 Test Report Structure

```
System Test Report
├── Executive Summary
│   ├── Total Tests: 150
│   ├── Passed: 145
│   ├── Failed: 3
│   ├── Skipped: 2
│   ├── Pass Rate: 96.7%
│   └── Duration: 45m 23s
├── Results by Tier
│   ├── Tier 1 (Critical): 25/25 passed
│   ├── Tier 2 (High): 50/52 passed, 2 failed
│   ├── Tier 3 (Medium): 50/51 passed, 1 failed
│   └── Tier 4 (Low): 20/20 passed
├── Results by Feature
│   ├── Migration Lifecycle: 30/30 passed
│   ├── Validation Pipeline: 25/25 passed
│   ├── User Management: 15/15 passed
│   ├── Reporting: 20/20 passed
│   ├── Notifications: 15/14 passed, 1 failed
│   └── Configuration: 10/10 passed
├── Failed Tests
│   ├── TN-001: Notification delivery timeout
│   ├── TN-002: Report export to PDF
│   └── TN-003: Concurrent migration pause
├── Test Environment
│   ├── Environment: staging
│   ├── Build: v1.4.0-build.234
│   └── Timestamp: 2026-07-02T06:30:00Z
└── Artifacts
    ├── Screenshots (on failure)
    ├── Videos (on failure)
    ├── Traces (on retry)
    └── Allure Report (HTML)
```

### 14.3 Defect Management

| Severity | Definition | Response Time | Resolution Time |
|----------|-----------|---------------|-----------------|
| P1 - Critical | System down, data loss, security breach | 1 hour | 4 hours |
| P2 - High | Major feature broken, no workaround | 4 hours | 24 hours |
| P3 - Medium | Feature broken, workaround exists | 24 hours | 72 hours |
| P4 - Low | Minor issue, cosmetic, documentation | 72 hours | Next sprint |

---

## 15. Traceability Matrix

### 15.1 Requirements to System Test Traceability

| Requirement ID | Requirement Description | System Test IDs | Coverage |
|----------------|------------------------|-----------------|----------|
| REQ-001 | User authentication and authorization | SY-001 to SY-010 | 100% |
| REQ-002 | Migration project creation | SY-011 to SY-020 | 100% |
| REQ-003 | Migration execution and monitoring | SY-021 to SY-035 | 100% |
| REQ-004 | Data validation pipeline | SY-036 to SY-050 | 100% |
| REQ-005 | Reporting and analytics | SY-051 to SY-060 | 100% |
| REQ-006 | Notification management | SY-061 to SY-070 | 100% |
| REQ-007 | Administrative configuration | SY-071 to SY-080 | 100% |
| REQ-008 | Audit trail and compliance | SY-081 to SY-090 | 100% |
| REQ-009 | Performance and scalability | SY-091 to SY-100 | 100% |
| REQ-010 | Accessibility compliance | SY-101 to SY-110 | 100% |

### 15.2 Test to Defect Traceability

| System Test ID | Defect IDs Found | Defect Status |
|----------------|-----------------|---------------|
| SY-025 | DEF-001, DEF-002 | RESOLVED |
| SY-045 | DEF-003 | OPEN |
| SY-067 | DEF-004, DEF-005 | DEF-004: RESOLVED, DEF-005: OPEN |

---

## 16. Dependencies

### 16.1 Internal Dependencies

| Dependency | Document | Batch | Relationship |
|------------|----------|-------|-------------|
| System Architecture | `08_MVP_Technical_Architecture/07_System_Architecture.md` | Batch 08 | Architecture defines system boundaries and component interactions for testing |
| API Architecture | `08_MVP_Technical_Architecture/11_API_Architecture.md` | Batch 08 | API contracts define integration test interfaces |
| Database Architecture | `08_MVP_Technical_Architecture/10_Database_Architecture.md` | Batch 08 | Database schema defines data validation requirements |
| Component Architecture | `08_MVP_Technical_Architecture/09_Component_Architecture.md` | Batch 08 | Component design defines service interaction patterns |
| UX Design Principles | `10_UX_UI_Design_System/01_UX_Design_Principles.md` | Batch 10 | UX patterns define UI testing requirements |
| Component Library | `10_UX_UI_Design_System/08_Component_Library.md` | Batch 10 | UI components define E2E test selectors |
| Navigation System | `10_UX_UI_Design_System/03_Navigation_System.md` | Batch 10 | Navigation flows define user journey tests |
| Dashboard Design | `10_UX_UI_Design_System/07_Dashboard_Design.md` | Batch 10 | Dashboard layouts define reporting test scenarios |
| Development Standards | `11_Development_Standards/01_Engineering_Handbook.md` | Batch 11 | Engineering practices define test automation standards |
| Testing Standards | `11_Development_Standards/11_Testing_Standards.md` | Batch 11 | Testing standards define system test requirements |
| Quality Assurance Strategy | `13_Testing_QA_UAT_Framework/01_Quality_Assurance_Strategy.md` | Batch 13 | QA strategy defines quality gates for system testing |
| Testing Strategy | `13_Testing_QA_UAT_Framework/02_Testing_Strategy.md` | Batch 13 | Testing strategy defines system test positioning |
| Test Planning Framework | `13_Testing_QA_UAT_Framework/03_Test_Planning_Framework.md` | Batch 13 | Test planning defines system test scheduling |
| Unit Testing Standards | `13_Testing_QA_UAT_Framework/04_Unit_Testing_Standards.md` | Batch 13 | Unit test foundations that system tests build upon |
| Integration Testing Standards | `13_Testing_QA_UAT_Framework/05_Integration_Testing_Standards.md` | Batch 13 | Integration test contracts that system tests validate |

### 16.2 External Dependencies

| Dependency | Type | Impact |
|------------|------|--------|
| Azure Subscription | Infrastructure | All cloud resources require active subscription |
| Azure DevOps | Tooling | CI/CD pipeline, test management, reporting |
| Playwright | Tooling | Browser automation framework |
| Allure | Tooling | Test reporting and results aggregation |
| OpenAI API | External Service | AI Service integration testing requires API access |

---

## 17. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | July 2026 | MAP Engineering & QA Team | Initial release |

---

## 18. Approval and Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | [TBD] | [TBD] | |
| Technical Lead | [TBD] | [TBD] | |
| Product Owner | [TBD] | [TBD] | |
| Programme Sponsor | [TBD] | [TBD] | |
| Head of Engineering | [TBD] | [TBD] | |
| VP of Quality | [TBD] | [TBD] | |

---

## 19. Appendices

### Appendix A: System Test Scenario Template

```markdown
# System Test Scenario: [Scenario Name]

| Field | Value |
|-------|-------|
| Scenario ID | SY-XXX |
| Priority | Critical / High / Medium / Low |
| Tier | 1 / 2 / 3 / 4 |
| Components | List of services/components involved |
| Prerequisites | Precondition setup requirements |
| Estimated Duration | X minutes |

## Preconditions
- [ ] Precondition 1
- [ ] Precondition 2

## Test Steps

### Step 1: [Step Name]
- **Action:** Description of the action
- **Expected Result:** Expected outcome
- **Verification:** How to verify the result

### Step 2: [Step Name]
- **Action:** Description of the action
- **Expected Result:** Expected outcome
- **Verification:** How to verify the result

## Cleanup
- [ ] Cleanup step 1
- [ ] Cleanup step 2

## Notes
Additional context or considerations.
```

### Appendix B: Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MAP_API_URL` | Base URL for MAP API | `http://localhost:8080` | Yes |
| `MAP_WEB_URL` | Base URL for MAP Web App | `http://localhost:3000` | Yes |
| `MAP_DB_CONNECTION_STRING` | Database connection string | - | Yes |
| `MAP_REDIS_URL` | Redis connection string | `localhost:6380` | Yes |
| `MAP_KEY_VAULT_URL` | Key Vault URL | - | Yes |
| `MAP_TEST_TOKEN` | Authentication token for tests | - | Yes |
| `MAP_ADMIN_TOKEN` | Admin authentication token | - | Yes |
| `MAP_LOG_LEVEL` | Log level for test services | `INFO` | No |
| `MAP_ENVIRONMENT` | Environment name | `test` | Yes |

### Appendix C: Related Documents

| Document | Location | Description |
|----------|----------|-------------|
| Quality Assurance Strategy | `13_Testing_QA_UAT_Framework/01_Quality_Assurance_Strategy.md` | Overall QA strategy and governance |
| Testing Strategy | `13_Testing_QA_UAT_Framework/02_Testing_Strategy.md` | Testing lifecycle and pyramid |
| Test Planning Framework | `13_Testing_QA_UAT_Framework/03_Test_Planning_Framework.md` | Test plan structure and templates |
| Unit Testing Standards | `13_Testing_QA_UAT_Framework/04_Unit_Testing_Standards.md` | Unit test conventions and standards |
| Integration Testing Standards | `13_Testing_QA_UAT_Framework/05_Integration_Testing_Standards.md` | Integration test standards and patterns |
| System Architecture | `08_MVP_Technical_Architecture/07_System_Architecture.md` | System design and component topology |
| UX Design Principles | `10_UX_UI_Design_System/01_UX_Design_Principles.md` | UI/UX standards for testing |

---

*End of System Testing Framework*
